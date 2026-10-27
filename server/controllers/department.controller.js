const pool = require("../config/db");

const getAllDepartments = async (req, res) => {
  try {
    const { search } = req.query;

    // 1. Ensure any department assigned to any doctor is in the departments table
    await pool.query(`
      INSERT INTO departments (name)
      SELECT DISTINCT TRIM(department) FROM doctor
      WHERE department IS NOT NULL AND TRIM(department) != ''
      ON CONFLICT (name) DO NOTHING
    `);

    // 2. Fetch departments along with doctor counts
    let query = `
      SELECT 
        d.id,
        d.name,
        d.name AS department_name,
        COUNT(doc.id)::int AS doctor_count
      FROM departments d
      LEFT JOIN doctor doc ON LOWER(TRIM(doc.department)) = LOWER(TRIM(d.name))
    `;
    const params = [];

    if (search && search.trim()) {
      query += ` WHERE LOWER(d.name) LIKE $1`;
      params.push(`%${search.trim().toLowerCase()}%`);
    }

    query += ` GROUP BY d.id, d.name ORDER BY d.name ASC`;

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      departments: result.rows,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: err.message,
    });
  }
};

const addDepartment = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Department name is required" });
  }
  try {
    const existing = await pool.query(
      "SELECT * FROM departments WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))",
      [name.trim()]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Department already exists" });
    }
    const result = await pool.query(
      "INSERT INTO departments (name) VALUES ($1) RETURNING *",
      [name.trim()]
    );
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department: result.rows[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add department",
      error: err.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM departments WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete department",
      error: err.message,
    });
  }
};

module.exports = { getAllDepartments, addDepartment, deleteDepartment };

