const db = require("../config/db");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodeEmailer");
const crypto = require("crypto");

// Helper function to generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

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
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Generate OTP
      const otp = generateOTP();

      // Store OTP in verification table
      // In registerPatient function, update the OTP insertion:
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO otp_verification (email, otp, expires_at, is_verified) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0) ON DUPLICATE KEY UPDATE otp = ?, expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE), is_verified = 0",
          [email, otp, otp],
          (err) => (err ? reject(err) : resolve())
        );
      });

      // Insert into patient (but mark as inactive)
      const patientInsert = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO patient (full_name, email, phone, password, is_active) VALUES (?, ?, ?, ?, FALSE)",
          [name, email, phone, password],
          (err, result) => (err ? reject(err) : resolve(result))
        );
      });

      // Insert into users (but mark as inactive)
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO users (email, password, role, reference_id, is_active) VALUES (?, ?, 'patient', ?, FALSE)",
          [email, password, patientInsert.insertId],
          (err) => (err ? reject(err) : resolve())
        );
      });

      await new Promise((resolve, reject) => {
        db.commit((err) => (err ? reject(err) : resolve()));
      });

      // Send OTP email (non-blocking)
      (async () => {
        try {
          const mailOptions = {
            from: {
              name: "Healthcare Service",
              address: "dirsanantehun739@gmail.com", // Your verified email
            },
            to: email,
            subject: "Your Verification OTP",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4f46e5;">Email Verification</h2>
                <p>Hello ${name},</p>
                <p>Thank you for registering with our healthcare service. Please use the following OTP to verify your email address:</p>
                <div style="background: #f3f4f6; padding: 16px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                  ${otp}
                </div>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>Healthcare Team</p>
              </div>
            `,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log("✅ OTP email sent successfully to:", email);
          console.log("✅ Message ID:", info.messageId);
        } catch (err) {
          console.error("❌ Failed to send OTP email:", err.message);
        }
      })();

      res.status(201).json({
        success: true,
        message: "OTP sent to your email for verification",
        email: email,
      });
    } catch (error) {
      await new Promise((resolve) => db.rollback(() => resolve()));
      console.error("Database error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  });
}

async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  // Add debug logging
  console.log("OTP Verification Request:", { email, otp });

  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    try {
      // 1. Verify OTP exists and is valid - FIXED QUERY
      const otpRecords = await new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM otp_verification 
           WHERE email = ? AND is_verified = 0
           AND expires_at > NOW()`,
          [email],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });

      console.log("OTP Records Found:", otpRecords);

      if (otpRecords.length === 0) {
        await new Promise((resolve) => db.rollback(() => resolve()));
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP. Please request a new one.",
        });
      }

      // Convert both OTPs to string for safe comparison
      const storedOTP = otpRecords[0].otp.toString().trim();
      const receivedOTP = otp.toString().trim();

      console.log("OTP Comparison:", {
        storedOTP,
        receivedOTP,
        match: storedOTP === receivedOTP,
      });

      if (storedOTP !== receivedOTP) {
        await new Promise((resolve) => db.rollback(() => resolve()));
        return res.status(400).json({
          success: false,
          message: "Incorrect OTP. Please try again.",
        });
      }

      // 2. Get patient data safely
      const patients = await new Promise((resolve, reject) => {
        db.query(
          `SELECT id, full_name FROM patient 
           WHERE email = ? LIMIT 1`,
          [email],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });

      if (patients.length === 0) {
        await new Promise((resolve) => db.rollback(() => resolve()));
        return res.status(400).json({
          success: false,
          message: "Patient record not found. Please register again.",
        });
      }

      // 3. Update records in transaction
      await new Promise((resolve, reject) => {
        db.query(
          `UPDATE otp_verification 
           SET is_verified = 1 
           WHERE email = ? AND otp = ?`,
          [email, storedOTP],
          (err) => (err ? reject(err) : resolve())
        );
      });

      await new Promise((resolve, reject) => {
        db.query(
          `UPDATE patient SET is_active = 1 WHERE email = ?`,
          [email],
          (err) => (err ? reject(err) : resolve())
        );
      });

      await new Promise((resolve, reject) => {
        db.query(
          `UPDATE users SET is_active = 1 
           WHERE email = ? AND role = 'patient'`,
          [email],
          (err) => (err ? reject(err) : resolve())
        );
      });

      await new Promise((resolve, reject) => {
        db.commit((err) => (err ? reject(err) : resolve()));
      });

      console.log("OTP verified successfully for:", email);

      // 4. Send welcome email (non-blocking)
      (async () => {
        try {
          const mailOptions = {
            from: {
              name: "Healthcare Service",
              address: "dirsanantehun739@gmail.com",
            },
            to: email,
            subject: "Welcome to Our Healthcare Service",
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5;">Welcome!</h2>
                    <p>Hello ${patients[0].full_name},</p>
                    <p>Your account has been verified successfully. You can now use our healthcare services.</p>
                    <p>Best regards,<br>Healthcare Team</p>
                  </div>`,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log(`✅ Welcome email sent to ${email}`);
          console.log("✅ Message ID:", info.messageId);
        } catch (emailError) {
          console.error("❌ Welcome email failed:", emailError);
        }
      })();

      return res.json({
        success: true,
        message: "Account verified successfully",
      });
    } catch (error) {
      await new Promise((resolve) => db.rollback(() => resolve()));
      console.error("OTP verification error:", error);

      return res.status(500).json({
        success: false,
        message: "OTP verification failed. Please try again.",
        ...(process.env.NODE_ENV === "development" && { error: error.message }),
      });
    }
  });
}

async function resendOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    // Check if patient exists but is not active
    const patients = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM patient WHERE email = ? AND is_active = FALSE",
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    if (!patients || patients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found for this email",
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Update OTP in database
    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE otp_verification SET otp = ?, created_at = CURRENT_TIMESTAMP, expires_at = (CURRENT_TIMESTAMP + INTERVAL 10 MINUTE), is_verified = FALSE WHERE email = ?",
        [otp, email],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Send new OTP email (non-blocking)
    (async () => {
      try {
        const mailOptions = {
          from: {
            name: "Healthcare Service",
            address: "dirsanantehun739@gmail.com", // Your verified email
          },
          to: email,
          subject: "Your New Verification OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4f46e5;">New Verification Code</h2>
              <p>Hello ${patients[0].full_name},</p>
              <p>Here is your new verification code:</p>
              <div style="background: #f3f4f6; padding: 16px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                ${otp}
              </div>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,<br>Healthcare Team</p>
            </div>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ New OTP email sent successfully to:", email);
        console.log("✅ Message ID:", info.messageId);
      } catch (err) {
        console.error("❌ Failed to send new OTP email:", err.message);
      }
    })();

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
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
  verifyOTP,
  resendOTP,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
  getCurrentPatient,
};
