const db = require("../config/db");

// Fetch all doctors
function getAllDoctors(req, res) {
  const query = "SELECT * FROM doctor";

  db.query(query, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch doctors",
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

function doctorRegistration(req, res) {
  const { doctorfullname, email, contact, pwd, department, experiance } =
    req.body;

  // Validate required fields
  if (
    !doctorfullname ||
    !email ||
    !pwd ||
    !contact ||
    !department ||
    !experiance
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Start transaction
  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    try {
      // Check if email exists in either doctor or users table
      const [doctorResults, userResults] = await Promise.all([
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM doctor WHERE email = ?",
            [email],
            (err, results) => {
              if (err) return reject(err);
              resolve(results);
            }
          );
        }),
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, results) => {
              if (err) return reject(err);
              resolve(results);
            }
          );
        }),
      ]);

      if (doctorResults.length > 0 || userResults.length > 0) {
        await new Promise((resolve) => db.rollback(() => resolve()));
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Insert into doctor table
      const doctorQuery = `
        INSERT INTO doctor 
        (doctorfullname, email, contact, pwd, department, experiance)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

      const doctorInsert = await new Promise((resolve, reject) => {
        db.query(
          doctorQuery,
          [doctorfullname, email, contact, pwd, department, experiance],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });

      // Insert into users table for authentication
      const userQuery = `
        INSERT INTO users 
        (email, password, role, reference_id)
        VALUES (?, ?, 'doctor', ?);
      `;

      await new Promise((resolve, reject) => {
        db.query(userQuery, [email, pwd, doctorInsert.insertId], (err) => {
          if (err) return reject(err);
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

      res.status(201).json({
        success: true,
        message: "Doctor registered successfully",
        doctorId: doctorInsert.insertId,
      });
    } catch (error) {
      // Rollback on error
      await new Promise((resolve) => db.rollback(() => resolve()));
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  });
}

// Update doctor by ID
function updateDoctorById(req, res) {
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

      res
        .status(200)
        .json({ success: true, message: "Doctor updated successfully" });
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
};
