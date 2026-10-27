const pool = require("../config/db");
const { cloudinary } = require("../config/cloudinaryConfig");

// Fetch all doctors
async function getAllDoctors(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        doctorfullname, 
        email, 
        contact, 
        department, 
        experiance,
        photo_url,
        CONCAT('D', LPAD(id::text, 3, '0')) as doctor_id
      FROM doctor
      ORDER BY doctorfullname
    `);

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      doctors: result.rows,
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
async function getDoctorById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM doctor WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({
      success: true,
      message: "Doctor fetched successfully",
      doctor: result.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch doctor", error: err.message });
  }
}

async function doctorRegistration(req, res) {
  const { doctorfullname, email, contact, pwd, department, experiance } = req.body;
  let photo_url = null;
  let cloudinaryResult = null;

  if (!doctorfullname || !email || !pwd || !contact || !department || !experiance) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if email exists in either doctor or users table
    const [doctorResults, userResults] = await Promise.all([
      client.query("SELECT * FROM doctor WHERE email = $1", [email]),
      client.query("SELECT * FROM users WHERE email = $1", [email]),
    ]);

    if (doctorResults.rows.length > 0 || userResults.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Handle file upload if exists
    if (req.file) {
      try {
        cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "doctor-photos",
          width: 500,
          height: 500,
          crop: "fill",
        });
        photo_url = cloudinaryResult.secure_url;
      } catch (uploadError) {
        await client.query("ROLLBACK");
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload photo",
          error: uploadError.message,
        });
      }
    }

    // Insert into doctor table
    const doctorInsert = await client.query(
      `INSERT INTO doctor 
      (doctorfullname, email, contact, pwd, department, experiance, photo_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [doctorfullname, email, contact, pwd, department, experiance, photo_url]
    );
    const doctorId = doctorInsert.rows[0].id;

    // Insert into users table for authentication
    await client.query(
      `INSERT INTO users (email, password, role, reference_id, is_active) VALUES ($1, $2, 'doctor', $3, true)`,
      [email, pwd, doctorId]
    );

    // Ensure department is saved in departments table
    if (department && department.trim()) {
      await client.query(
        `INSERT INTO departments (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [department.trim()]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      doctorId: doctorId,
      photo_url: photo_url || null,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (cloudinaryResult) {
      try {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      } catch (cleanupError) {
        console.error("Failed to cleanup uploaded photo:", cleanupError);
      }
    }

    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    client.release();
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, id } = req.body;

    if (!currentPassword || !newPassword || !id) {
      return res.status(400).json({
        success: false,
        message: "Current password, new password, and doctor ID are required",
      });
    }

    const doctorResult = await pool.query("SELECT * FROM doctor WHERE id = $1", [id]);
    if (doctorResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    const doctor = doctorResult.rows[0];

    if (currentPassword !== doctor.pwd) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    await pool.query("UPDATE doctor SET pwd = $1 WHERE id = $2", [newPassword, id]);
    await pool.query("UPDATE users SET password = $1 WHERE role = 'doctor' AND reference_id = $2", [newPassword, id]);

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: error.message || "Error changing password" });
  }
};

// Update doctor by ID
async function updateDoctorById(req, res) {
  const id = req.params.id;
  const { doctorfullname, email, contact, pwd, department, experiance } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existingResult = await client.query("SELECT * FROM doctor WHERE id = $1", [id]);
    if (existingResult.rows.length === 0) throw new Error("Doctor not found");
    const existingDoctor = existingResult.rows[0];

    // Handle photo upload if provided
    let photo_url = existingDoctor.photo_url;
    if (req.file) {
      if (photo_url) {
        const publicId = photo_url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`doctor-photos/${publicId}`);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      photo_url = result.secure_url;
    }

    const fieldsToUpdate = [];
    const values = [];
    let idx = 1;

    if (doctorfullname && doctorfullname !== existingDoctor.doctorfullname) { fieldsToUpdate.push(`doctorfullname = $${idx++}`); values.push(doctorfullname); }
    if (email && email !== existingDoctor.email) { fieldsToUpdate.push(`email = $${idx++}`); values.push(email); }
    if (contact && contact !== existingDoctor.contact) { fieldsToUpdate.push(`contact = $${idx++}`); values.push(contact); }
    if (pwd && pwd !== existingDoctor.pwd) { fieldsToUpdate.push(`pwd = $${idx++}`); values.push(pwd); }
    if (department && department !== existingDoctor.department) { fieldsToUpdate.push(`department = $${idx++}`); values.push(department); }
    if (experiance && experiance !== existingDoctor.experiance) { fieldsToUpdate.push(`experiance = $${idx++}`); values.push(experiance); }
    if (req.file) { fieldsToUpdate.push(`photo_url = $${idx++}`); values.push(photo_url); }

    if (fieldsToUpdate.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "No changes made" });
    }

    values.push(id);
    await client.query(
      `UPDATE doctor SET ${fieldsToUpdate.join(", ")} WHERE id = $${idx}`,
      values
    ).catch((err) => {
      if (err.code === "23505") throw new Error("Email already used by another doctor");
      throw err;
    });

    if (email || pwd) {
      const userFields = [];
      const userValues = [];
      let uIdx = 1;
      if (email) { userFields.push(`email = $${uIdx++}`); userValues.push(email); }
      if (pwd) { userFields.push(`password = $${uIdx++}`); userValues.push(pwd); }
      userValues.push(id);
      await client.query(
        `UPDATE users SET ${userFields.join(", ")} WHERE role = 'doctor' AND reference_id = $${uIdx}`,
        userValues
      );
    }

    // Ensure department is saved in departments table if updated
    if (department && department.trim()) {
      await client.query(
        `INSERT INTO departments (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [department.trim()]
      );
    }

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      photo_url: photo_url || existingDoctor.photo_url,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating doctor:", error);
    if (error.message === "Doctor not found") return res.status(404).json({ success: false, message: error.message });
    if (error.message === "Email already used by another doctor") return res.status(409).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Update failed" });
  } finally {
    client.release();
  }
}

async function deleteDoctorById(req, res) {
  const id = req.params.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM users WHERE role = 'doctor' AND reference_id = $1", [id]);

    const result = await client.query("DELETE FROM doctor WHERE id = $1", [id]);
    if (result.rowCount === 0) throw new Error("Doctor not found");

    await client.query("COMMIT");
    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database error:", error);
    if (error.message === "Doctor not found") return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Failed to delete doctor", error: error.message });
  } finally {
    client.release();
  }
}

async function getDoctorsByDepartment(req, res) {
  const { department } = req.query;

  if (!department) {
    return res.status(400).json({ success: false, message: "Department parameter is required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, doctorfullname AS name, department FROM doctor WHERE department = $1",
      [department]
    );
    res.status(200).json({ success: true, message: "Doctors fetched successfully", doctors: result.rows });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch doctors by department", error: err.message });
  }
}

async function getAllDepartments(req, res) {
  try {
    const result = await pool.query("SELECT DISTINCT department FROM doctor ORDER BY department");
    const departments = result.rows.map((item) => item.department);
    res.status(200).json({ success: true, message: "Departments fetched successfully", departments });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch departments", error: err.message });
  }
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
