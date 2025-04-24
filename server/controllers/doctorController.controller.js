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

// Update doctor by ID

function updateDoctorById(req, res) {
  const id = req.params.id;
  const { doctorfullname, email, contact, pwd, department, experiance } =
    req.body;

  // Fetch current doctor data
  const getDoctorQuery = "SELECT * FROM doctor WHERE id = ?";
  db.query(getDoctorQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching doctor:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const existingDoctor = results[0];

    // Build only the fields that need to be updated
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
      return res
        .status(400)
        .json({ success: false, message: "No changes made" });
    }

    // Build the update query
    const updateQuery = `UPDATE doctor SET ${fieldsToUpdate.join(
      ", "
    )} WHERE id = ?`;
    values.push(id); // Add id to the end

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json({
              success: false,
              message: "Email already used by another doctor",
            });
        }
        console.error("Error updating doctor:", err);
        return res
          .status(500)
          .json({ success: false, message: "Update failed" });
      }

      res
        .status(200)
        .json({ success: true, message: "Doctor updated successfully" });
    });
  });
}

function deleteDoctorById(req, res) {
  const id = req.params.id;
  const query = "DELETE FROM doctor WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
    } else {
      res.status(200).json({
        success: true,
        message: "user delted",
      });
    }
  });
}

module.exports = {
  doctorRegistration,
  getAllDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
};
