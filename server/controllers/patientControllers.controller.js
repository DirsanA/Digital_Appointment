const db = require("../config/db");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodeEmailer");

async function registerPatient(req, res) {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    try {
      // Check if email exists
      const [patientResults, userResults] = await Promise.all([
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM patient WHERE email = ?",
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

      if (patientResults.length > 0 || userResults.length > 0) {
        await new Promise((resolve) => db.rollback(() => resolve()));
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }

      // Insert into patient
      const patientInsert = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO patient (full_name, email, phone, password) VALUES (?, ?, ?, ?)",
          [name, email, phone, password],
          (err, result) => (err ? reject(err) : resolve(result))
        );
      });

      // Insert into users
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO users (email, password, role, reference_id) VALUES (?, ?, 'patient', ?)",
          [email, password, patientInsert.insertId],
          (err) => (err ? reject(err) : resolve())
        );
      });

      await new Promise((resolve, reject) => {
        db.commit((err) => (err ? reject(err) : resolve()));
      });

      // Respond success
      res.status(201).json({
        success: true,
        message: "Patient registered successfully",
        patientId: patientInsert.insertId,
      });

      // Fire email (non-blocking)
      (async () => {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Welcome to Our Service",
            text: `Hello ${name},\n\nThank you for registering as a patient.\n\nBest regards,\nYour Healthcare Team`,
          });
          console.log("✅ Welcome email sent successfully to:", email);
        } catch (err) {
          console.error("❌ Failed to send welcome email:", err.message);
        }
      })();
    } catch (error) {
      await new Promise((resolve) => db.rollback(() => resolve()));
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Registration failed" });
    }
  });
}

// Fetch all patients
function getAllPatients(req, res) {
  const query = "SELECT * FROM patient";

  db.query(query, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch patients",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      patients: results,
    });
  });
}

// Fetch single patient by ID
function getPatientById(req, res) {
  const { id } = req.params;

  const query = "SELECT * FROM patient WHERE id = ?";

  db.query(query, [id], function (err, results) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch patient",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient fetched successfully",
      patient: results[0],
    });
  });
}

// Update patient by ID
function updatePatientById(req, res) {
  const id = req.params.id;
  const { name, email, phone, password } = req.body;

  // Start transaction
  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    try {
      // Fetch current patient data
      const existingPatient = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM patient WHERE id = ?", [id], (err, results) => {
          if (err) return reject(err);
          if (results.length === 0)
            return reject(new Error("Patient not found"));
          resolve(results[0]);
        });
      });

      // Build fields to update
      const fieldsToUpdate = [];
      const values = [];

      if (name && name !== existingPatient.full_name) {
        fieldsToUpdate.push("full_name = ?");
        values.push(name);
      }

      if (email && email !== existingPatient.email) {
        fieldsToUpdate.push("email = ?");
        values.push(email);
      }

      if (phone && phone !== existingPatient.phone) {
        fieldsToUpdate.push("phone = ?");
        values.push(phone);
      }

      if (password && password !== existingPatient.password) {
        fieldsToUpdate.push("password = ?");
        values.push(password);
      }

      // If nothing to update
      if (fieldsToUpdate.length === 0) {
        await new Promise((resolve) => db.rollback(() => resolve()));
        return res
          .status(400)
          .json({ success: false, message: "No changes made" });
      }

      // Update patient table
      const updatePatientQuery = `UPDATE patient SET ${fieldsToUpdate.join(
        ", "
      )} WHERE id = ?`;
      const patientValues = [...values, id];

      await new Promise((resolve, reject) => {
        db.query(updatePatientQuery, patientValues, (err) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return reject(new Error("Email already used by another patient"));
            }
            return reject(err);
          }
          resolve();
        });
      });

      // Update users table if email or password changed
      if (email || password) {
        const userFieldsToUpdate = [];
        const userValues = [];

        if (email) {
          userFieldsToUpdate.push("email = ?");
          userValues.push(email);
        }

        if (password) {
          userFieldsToUpdate.push("password = ?");
          userValues.push(password);
        }

        if (userFieldsToUpdate.length > 0) {
          const updateUserQuery = `UPDATE users SET ${userFieldsToUpdate.join(
            ", "
          )} WHERE role = 'patient' AND reference_id = ?`;
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
        .json({ success: true, message: "Patient updated successfully" });
    } catch (error) {
      // Rollback on error
      await new Promise((resolve) => db.rollback(() => resolve()));
      console.error("Error updating patient:", error);

      if (error.message === "Patient not found") {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error.message === "Email already used by another patient") {
        return res.status(409).json({ success: false, message: error.message });
      }

      res.status(500).json({ success: false, message: "Update failed" });
    }
  });
}

// Delete patient by ID
function deletePatientById(req, res) {
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
          "DELETE FROM users WHERE role = 'patient' AND reference_id = ?",
          [id],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });

      // Then delete from patient table
      await new Promise((resolve, reject) => {
        db.query("DELETE FROM patient WHERE id = ?", [id], (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 0) {
            return reject(new Error("Patient not found"));
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
        message: "Patient deleted successfully",
      });
    } catch (error) {
      // Rollback on error
      await new Promise((resolve) => db.rollback(() => resolve()));
      console.error("Database error:", error);

      if (error.message === "Patient not found") {
        return res.status(404).json({ success: false, message: error.message });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete patient",
        error: error.message,
      });
    }
  });
}

// Get current patient profile using JWT token
function getCurrentPatient(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    if (!decoded.id || decoded.role !== "patient") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const query =
      "SELECT id, full_name, email, phone FROM patient WHERE id = ?";

    db.query(query, [decoded.id], function (err, results) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch patient profile",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Patient profile fetched successfully",
        data: results[0],
      });
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}

module.exports = {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
  getCurrentPatient,
};
