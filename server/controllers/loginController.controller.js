const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

const loginCheck = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Fixed admin credential
  if (email === "desalegnmulat5@gmail.com" && password === "123456") {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      { userId: 0, email, role: "admin", reference_id: null, is_active: 1 },
      secret,
      { expiresIn: "1d" }
    );
    return res.json({ token, role: "admin", is_active: 1 });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    if (user.is_active !== true && user.is_active !== 1) {
      return res.status(401).json({
        message: "Account not activated. Please verify your email or contact administrator.",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET || "your-secret-key";
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

    switch (user.role) {
      case "patient":
        return res.json({ token, role: user.role, patientId: user.reference_id, is_active: user.is_active });
      case "doctor":
        return res.json({ token, role: user.role, doctorId: user.reference_id, is_active: user.is_active });
      case "admin":
        return res.json({ token, role: user.role, is_active: user.is_active });
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginCheck };
