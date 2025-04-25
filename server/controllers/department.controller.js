const db = require("../config/db");

getAllDepartments = (req, res) => {
  const query = "SELECT * FROM departments";

  db.query(query, function (err, results) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch departments",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      departments: results,
    });
  });
};

module.exports = { getAllDepartments };
