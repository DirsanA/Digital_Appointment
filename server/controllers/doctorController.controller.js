const db = require("../config/db");

// Doctor Registration (existing)

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

  // Check if email already exists
  db.query("SELECT * FROM doctor WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Insert new doctor
    const query = `
        INSERT INTO doctor 
        (doctorfullname, email, contact, pwd, department, experiance)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

    db.query(
      query,
      [doctorfullname, email, contact, pwd, department, experiance],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: err.message,
          });
        }

        res.status(201).json({
          success: true,
          message: "Doctor registered successfully",
          doctorId: result.insertId,
        });
      }
    );
  });
}

module.exports = {
  doctorRegistration,
  getAllDoctors,
  getDoctorById,
};
