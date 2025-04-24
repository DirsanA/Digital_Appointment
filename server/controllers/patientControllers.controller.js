const db = require("../config/db");
function registerPatient(req, res) {
  const { name, email, phone, password } = req.body;

  // Basic validation
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `INSERT INTO patient (full_name, email, phone, password) VALUES (?, ?, ?, ?);`;

  db.query(query, [name, email, phone, password], function (err, result) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        message: "Registration failed",
        error: err.message,
      });
    }

    console.log("Registration successful:", result);
    res.status(201).json({
      message: "Patient registered successfully",
      patientId: result.insertId,
    });
  });
}

module.exports = { registerPatient };
