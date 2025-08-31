const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const loginCheck = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Check if user account is active
    if (user.is_active !== 1) {
      return res.status(401).json({
        message:
          "Account not activated. Please verify your email or contact administrator.",
      });
    }

    // Compare passwords - in a real app, you should use bcrypt or similar
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Use JWT secret from .env file
    const secret = process.env.JWT_SECRET || "your-secret-key"; // Fallback secret for development

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        reference_id: user.reference_id,
        is_active: user.is_active,
      },
      secret,
      { expiresIn: "1d" }
    );

    // Return role-specific response
    switch (user.role) {
      case "patient":
        return res.json({
          token,
          role: user.role,
          patientId: user.reference_id,
          is_active: user.is_active,
        });
      case "doctor":
        return res.json({
          token,
          role: user.role,
          doctorId: user.reference_id,
          is_active: user.is_active,
        });
      case "admin":
        return res.json({
          token,
          role: user.role,
          is_active: user.is_active,
        });
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }
  });
};

module.exports = { loginCheck };
