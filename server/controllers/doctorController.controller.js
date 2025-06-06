const db = require("../config/db"); // Make sure you have this import

const { cloudinary } = require("../config/cloudinaryConfig");

// Fetch all doctors
async function getAllDoctors(req, res) {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        id, 
        doctorfullname, 
        email, 
        contact, 
        department, 
        experiance,
        photo_url,
        CONCAT('D', LPAD(id, 3, '0')) as doctor_id
      FROM doctor
      ORDER BY doctorfullname
    `);

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      doctors: results,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

// Fetch single doctor by ID
function getDoctorById(req, res) {
  const { id } = req.params;

  const query = "SELECT * FROM doctor WHERE id = ?";

  db.query(query, [id], function (err, results) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch doctor",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor fetched successfully",
      doctor: results[0],
    });
  });
}

async function doctorRegistration(req, res) {
  try {
    const { doctorfullname, email, contact, pwd, department, experiance } =
      req.body;
    let photo_url = null;

    // Handle file upload if exists
    if (req.file) {
      // Using req.file since we'll use upload.single()
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "doctor-photos",
        width: 500,
        height: 500,
        crop: "fill",
      });
      photo_url = result.secure_url;
    }

    // Validate required fields
    if (
      !doctorfullname ||
      !email ||
      !pwd ||
      !contact ||
      !department ||
      !experiance
    ) {
      // Delete uploaded file if validation fails
      if (photo_url) {
        await cloudinary.uploader.destroy(result.public_id);
      }
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Insert into database
    const [result] = await db.promise().query(
      `INSERT INTO doctor 
      (doctorfullname, email, contact, pwd, department, experiance, photo_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [doctorfullname, email, contact, pwd, department, experiance, photo_url]
    );

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      doctorId: result.insertId,
      photo_url: photo_url || null,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, id } = req.body;

    // Validate all required fields
    if (!currentPassword || !newPassword || !id) {
      return res.status(400).json({
        success: false,
        message: "Current password, new password, and doctor ID are required",
      });
    }

    // Fetch doctor from database
    const doctor = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM doctor WHERE id = ?", [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) {
          return reject(new Error("Doctor not found"));
        }
        resolve(results[0]);
      });
    });

    // Compare passwords directly (no hashing)
    if (currentPassword !== doctor.pwd) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password in database (store plain text)
    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE doctor SET pwd = ? WHERE id = ?",
        [newPassword, id],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Also update in users table if needed
    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET password = ? WHERE role = 'doctor' AND reference_id = ?",
        [newPassword, id],
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error changing password",
    });
  }
};

// Update doctor by ID
async function updateDoctorById(req, res) {
  const id = req.params.id;
  const { doctorfullname, email, contact, pwd, department, experiance } =
    req.body;

  // Start transaction
  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    try {
      // Fetch current doctor data
      const existingDoctor = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM doctor WHERE id = ?", [id], (err, results) => {
          if (err) return reject(err);
          if (results.length === 0)
            return reject(new Error("Doctor not found"));
          resolve(results[0]);
        });
      });

      // Handle photo upload if provided
      let photo_url = existingDoctor.photo_url;
      if (req.file) {
        // Delete old photo from Cloudinary if exists
        if (photo_url) {
          const publicId = photo_url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`doctor-photos/${publicId}`);
        }
        // Upload new photo
        const result = await cloudinary.uploader.upload(req.file.path);
        photo_url = result.secure_url;
      }

      // Build fields to update
      const fieldsToUpdate = [];
      const values = [];

      if (doctorfullname && doctorfullname !== existingDoctor.doctorfullname) {
        fieldsToUpdate.push("doctorfullname = ?");
        values.push(doctorfullname);
      }

      if (email && email !== existingDoctor.email) {
        fieldsToUpdate.push("email = ?");
        values.push(email);
      }

      if (contact && contact !== existingDoctor.contact) {
        fieldsToUpdate.push("contact = ?");
        values.push(contact);
      }

      if (pwd && pwd !== existingDoctor.pwd) {
        fieldsToUpdate.push("pwd = ?");
        values.push(pwd);
      }

      if (department && department !== existingDoctor.department) {
        fieldsToUpdate.push("department = ?");
        values.push(department);
      }

      if (experiance && experiance !== existingDoctor.experiance) {
        fieldsToUpdate.push("experiance = ?");
        values.push(experiance);
      }

      // Add photo_url to update if it was changed
      if (req.file) {
        fieldsToUpdate.push("photo_url = ?");
        values.push(photo_url);
      }

      // If nothing to update
      if (fieldsToUpdate.length === 0) {
        await new Promise((resolve) => db.rollback(() => resolve()));
        return res
          .status(400)
          .json({ success: false, message: "No changes made" });
      }

      // Update doctor table
      const updateDoctorQuery = `UPDATE doctor SET ${fieldsToUpdate.join(
        ", "
      )} WHERE id = ?`;
      const doctorValues = [...values, id];

      await new Promise((resolve, reject) => {
        db.query(updateDoctorQuery, doctorValues, (err) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return reject(new Error("Email already used by another doctor"));
            }
            return reject(err);
          }
          resolve();
        });
      });

      // Update users table if email or password changed
      if (email || pwd) {
        const userFieldsToUpdate = [];
        const userValues = [];

        if (email) {
          userFieldsToUpdate.push("email = ?");
          userValues.push(email);
        }

        if (pwd) {
          userFieldsToUpdate.push("password = ?");
          userValues.push(pwd);
        }

        if (userFieldsToUpdate.length > 0) {
          const updateUserQuery = `UPDATE users SET ${userFieldsToUpdate.join(
            ", "
          )} WHERE role = 'doctor' AND reference_id = ?`;
          userValues.push(id);

          await new Promise((resolve, reject) => {
            db.query(updateUserQuery, userValues, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        }
      }

      // Commit transaction
      await new Promise((resolve, reject) => {
        db.commit((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      res.status(200).json({
        success: true,
        message: "Doctor updated successfully",
        photo_url: photo_url || existingDoctor.photo_url,
      });
    } catch (error) {
      // Rollback on error
      await new Promise((resolve) => db.rollback(() => resolve()));
      console.error("Error updating doctor:", error);

      if (error.message === "Doctor not found") {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error.message === "Email already used by another doctor") {
        return res.status(409).json({ success: false, message: error.message });
      }

      res.status(500).json({ success: false, message: "Update failed" });
    }
  });
}

function deleteDoctorById(req, res) {
  const id = req.params.id;

  // Start transaction
  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    try {
      // First delete from users table
      await new Promise((resolve, reject) => {
        db.query(
          "DELETE FROM users WHERE role = 'doctor' AND reference_id = ?",
          [id],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });

      // Then delete from doctor table
      await new Promise((resolve, reject) => {
        db.query("DELETE FROM doctor WHERE id = ?", [id], (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 0) {
            return reject(new Error("Doctor not found"));
          }
          resolve();
        });
      });

      // Commit transaction
      await new Promise((resolve, reject) => {
        db.commit((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      res.status(200).json({
        success: true,
        message: "Doctor deleted successfully",
      });
    } catch (error) {
      // Rollback on error
      await new Promise((resolve) => db.rollback(() => resolve()));
      console.error("Database error:", error);

      if (error.message === "Doctor not found") {
        return res.status(404).json({ success: false, message: error.message });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete doctor",
        error: error.message,
      });
    }
  });
}

function getDoctorsByDepartment(req, res) {
  const { department } = req.query;

  if (!department) {
    return res.status(400).json({
      success: false,
      message: "Department parameter is required",
    });
  }

  const query =
    "SELECT id, doctorfullname AS name, department FROM doctor WHERE department = ?";

  db.query(query, [department], function (err, results) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch doctors by department",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      doctors: results,
    });
  });
}

function getAllDepartments(req, res) {
  const query = "SELECT DISTINCT department FROM doctor ORDER BY department";

  db.query(query, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch departments",
        error: err.message,
      });
    }

    const departments = results.map((item) => item.department);

    res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      departments: departments,
    });
  });
}
module.exports = {
  doctorRegistration,
  getAllDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
  getDoctorsByDepartment,
  changePassword,
};
