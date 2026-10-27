const pool = require("../config/db");
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

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if email exists
    const [patientResults, userResults] = await Promise.all([
      client.query("SELECT * FROM patient WHERE email = $1", [email]),
      client.query("SELECT * FROM users WHERE email = $1", [email]),
    ]);

    if (patientResults.rows.length > 0 || userResults.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in verification table
    await client.query(
      `INSERT INTO otp_verification (email, otp, expires_at, is_verified)
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes', 0)
       ON CONFLICT (email) DO UPDATE
         SET otp = $2, expires_at = NOW() + INTERVAL '10 minutes', is_verified = 0`,
      [email, otp]
    );

    // Insert into patient (but mark as inactive)
    const patientInsert = await client.query(
      "INSERT INTO patient (full_name, email, phone, password, is_active) VALUES ($1, $2, $3, $4, FALSE) RETURNING id",
      [name, email, phone, password]
    );
    const patientId = patientInsert.rows[0].id;

    // Insert into users (but mark as inactive)
    await client.query(
      "INSERT INTO users (email, password, role, reference_id, is_active) VALUES ($1, $2, 'patient', $3, FALSE)",
      [email, password, patientId]
    );

    await client.query("COMMIT");

    // Send OTP email (non-blocking)
    (async () => {
      try {
        const mailOptions = {
          from: {
            name: "Healthcare Service",
            address: "desalegnmulat5@gmail.com",
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
    await client.query("ROLLBACK");
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  } finally {
    client.release();
  }
}

async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  console.log("OTP Verification Request:", { email, otp });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Verify OTP exists and is valid
    const otpResult = await client.query(
      `SELECT * FROM otp_verification
       WHERE email = $1 AND is_verified = 0
       AND expires_at > NOW()`,
      [email]
    );
    const otpRecords = otpResult.rows;

    console.log("OTP Records Found:", otpRecords);

    if (otpRecords.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new one.",
      });
    }

    const storedOTP = otpRecords[0].otp.toString().trim();
    const receivedOTP = otp.toString().trim();

    console.log("OTP Comparison:", { storedOTP, receivedOTP, match: storedOTP === receivedOTP });

    if (storedOTP !== receivedOTP) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    // 2. Get patient data safely
    const patientResult = await client.query(
      `SELECT id, full_name FROM patient WHERE email = $1 LIMIT 1`,
      [email]
    );
    const patients = patientResult.rows;

    if (patients.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Patient record not found. Please register again.",
      });
    }

    // 3. Update records in transaction
    await client.query(
      `UPDATE otp_verification SET is_verified = 1 WHERE email = $1 AND otp = $2`,
      [email, storedOTP]
    );

    await client.query(
      `UPDATE patient SET is_active = true WHERE email = $1`,
      [email]
    );

    await client.query(
      `UPDATE users SET is_active = true WHERE email = $1 AND role = 'patient'`,
      [email]
    );

    await client.query("COMMIT");

    console.log("OTP verified successfully for:", email);

    // 4. Send welcome email (non-blocking)
    (async () => {
      try {
        const mailOptions = {
          from: { name: "Healthcare Service", address: "dirsanantehun739@gmail.com" },
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

    return res.json({ success: true, message: "Account verified successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  } finally {
    client.release();
  }
}

// Fetch all patients
async function getAllPatients(req, res) {
  try {
    const result = await pool.query("SELECT * FROM patient");
    res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      patients: result.rows,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: err.message,
    });
  }
}

// Fetch single patient by ID
async function getPatientById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM patient WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    res.status(200).json({
      success: true,
      message: "Patient fetched successfully",
      patient: result.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
      error: err.message,
    });
  }
}

// Update patient by ID
async function updatePatientById(req, res) {
  const id = req.params.id;
  const { name, email, phone, password } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existingResult = await client.query("SELECT * FROM patient WHERE id = $1", [id]);
    if (existingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    const existingPatient = existingResult.rows[0];

    const fieldsToUpdate = [];
    const values = [];
    let idx = 1;

    if (name && name !== existingPatient.full_name) {
      fieldsToUpdate.push(`full_name = $${idx++}`);
      values.push(name);
    }
    if (email && email !== existingPatient.email) {
      fieldsToUpdate.push(`email = $${idx++}`);
      values.push(email);
    }
    if (phone && phone !== existingPatient.phone) {
      fieldsToUpdate.push(`phone = $${idx++}`);
      values.push(phone);
    }
    if (password && password !== existingPatient.password) {
      fieldsToUpdate.push(`password = $${idx++}`);
      values.push(password);
    }

    if (fieldsToUpdate.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "No changes made" });
    }

    values.push(id);
    await client.query(
      `UPDATE patient SET ${fieldsToUpdate.join(", ")} WHERE id = $${idx}`,
      values
    ).catch((err) => {
      if (err.code === "23505") throw new Error("Email already used by another patient");
      throw err;
    });

    if (email || password) {
      const userFields = [];
      const userValues = [];
      let uIdx = 1;
      if (email) { userFields.push(`email = $${uIdx++}`); userValues.push(email); }
      if (password) { userFields.push(`password = $${uIdx++}`); userValues.push(password); }
      userValues.push(id);
      await client.query(
        `UPDATE users SET ${userFields.join(", ")} WHERE role = 'patient' AND reference_id = $${uIdx}`,
        userValues
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ success: true, message: "Patient updated successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating patient:", error);
    if (error.message === "Patient not found") return res.status(404).json({ success: false, message: error.message });
    if (error.message === "Email already used by another patient") return res.status(409).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Update failed" });
  } finally {
    client.release();
  }
}

// Delete patient by ID
async function deletePatientById(req, res) {
  const id = req.params.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM users WHERE role = 'patient' AND reference_id = $1", [id]);

    const result = await client.query("DELETE FROM patient WHERE id = $1", [id]);
    if (result.rowCount === 0) throw new Error("Patient not found");

    await client.query("COMMIT");
    res.status(200).json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database error:", error);
    if (error.message === "Patient not found") return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Failed to delete patient", error: error.message });
  } finally {
    client.release();
  }
}

// Get current patient profile using JWT token
async function getCurrentPatient(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    if (!decoded.id || decoded.role !== "patient") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const result = await pool.query(
      "SELECT id, full_name, email, phone FROM patient WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      message: "Patient profile fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

// Forgot Password - Send OTP
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    const otp = generateOTP();

    await pool.query(
      `INSERT INTO password_reset_otps (email, otp, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes')
       ON CONFLICT (email) DO UPDATE
         SET otp = $2, expires_at = NOW() + INTERVAL '10 minutes'`,
      [email, otp]
    );

    // Send OTP email (non-blocking)
    (async () => {
      try {
        const mailOptions = {
          from: { name: "Healthcare Service", address: "dirsanantehun739@gmail.com" },
          to: email,
          subject: "Password Reset OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4f46e5;">Password Reset Request</h2>
              <p>We received a request to reset your password. Use the following OTP to proceed:</p>
              <div style="background: #f3f4f6; padding: 16px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                ${otp}
              </div>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't request a password reset, please ignore this email.</p>
              <p>Best regards,<br>Healthcare Team</p>
            </div>
          `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Password reset OTP email sent successfully to:", email);
        console.log("✅ Message ID:", info.messageId);
      } catch (err) {
        console.error("❌ Failed to send password reset OTP email:", err.message);
      }
    })();

    res.status(200).json({ success: true, message: "OTP sent to your email for password reset" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Failed to process password reset request" });
  }
}

// Verify Password Reset OTP
async function verifyPasswordResetOTP(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM password_reset_otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()`,
      [email, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
}

// Reset Password
async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verify OTP first
    const otpResult = await client.query(
      `SELECT * FROM password_reset_otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()`,
      [email, otp]
    );

    if (otpResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Update password in users table
    await client.query("UPDATE users SET password = $1 WHERE email = $2", [newPassword, email]);

    // Update password in patient/doctor table based on role
    const userResult = await client.query(
      "SELECT role, reference_id FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      let updateQuery = "";
      if (user.role === "patient") updateQuery = "UPDATE patient SET password = $1 WHERE id = $2";
      else if (user.role === "doctor") updateQuery = "UPDATE doctor SET password = $1 WHERE id = $2";
      else if (user.role === "admin") updateQuery = "UPDATE admin SET password = $1 WHERE id = $2";

      if (updateQuery) {
        await client.query(updateQuery, [newPassword, user.reference_id]);
      }
    }

    // Delete the used OTP
    await client.query("DELETE FROM password_reset_otps WHERE email = $1 AND otp = $2", [email, otp]);

    await client.query("COMMIT");
    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Password reset error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  } finally {
    client.release();
  }
}

// Resend Password Reset OTP
async function resendPasswordResetOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    const otp = generateOTP();

    await pool.query(
      `UPDATE password_reset_otps SET otp = $1, expires_at = NOW() + INTERVAL '10 minutes' WHERE email = $2`,
      [otp, email]
    );

    // Send new OTP email (non-blocking)
    (async () => {
      try {
        const mailOptions = {
          from: { name: "Healthcare Service", address: "dirsanantehun739@gmail.com" },
          to: email,
          subject: "New Password Reset OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4f46e5;">New Password Reset Code</h2>
              <p>Here is your new verification code for password reset:</p>
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
        console.log("✅ New password reset OTP email sent successfully to:", email);
        console.log("✅ Message ID:", info.messageId);
      } catch (err) {
        console.error("❌ Failed to send new password reset OTP email:", err.message);
      }
    })();

    res.status(200).json({ success: true, message: "New OTP sent to your email" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP" });
  }
}

module.exports = {
  registerPatient,
  verifyOTP,
  forgotPassword,
  verifyPasswordResetOTP,
  resetPassword,
  resendPasswordResetOTP,
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
  getCurrentPatient,
};
