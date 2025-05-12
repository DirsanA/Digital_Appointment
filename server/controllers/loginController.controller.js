const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const loginCheck = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Use JWT secret from .env file
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1d" }
    );

    return res.json({ token, role: user.role });
  });
};

// Make sure the function is exported properly
module.exports = { loginCheck };
