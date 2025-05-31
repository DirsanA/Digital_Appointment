const db = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    // Get counts for different stats
    const [patients] = await db
      .promise()
      .query("SELECT COUNT(*) as count FROM patient");
    const [doctors] = await db
      .promise()
      .query("SELECT COUNT(*) as count FROM doctor");
    const [appointments] = await db
      .promise()
      .query("SELECT COUNT(*) as count FROM appointments");
    const [todayAppointments] = await db
      .promise()
      .query(
        "SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date) = CURDATE()"
      );

    // Get status distribution
    const [statusDistribution] = await db.promise().query(
      `SELECT 
        status as name, 
        COUNT(*) as value,
        CASE status
          WHEN 'pending' THEN '#F59E0B'
          WHEN 'accepted' THEN '#10B981'
          WHEN 'cancelled' THEN '#EF4444'
          WHEN 'completed' THEN '#3B82F6'
          ELSE '#6B7280'
        END as color
      FROM appointments 
      GROUP BY status`
    );

    res.json({
      success: true,
      data: {
        totalPatients: patients[0].count,
        totalDoctors: doctors[0].count,
        totalAppointments: appointments[0].count,
        todayAppointments: todayAppointments[0].count,
        statusDistribution,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

const getGraphData = async (req, res) => {
  try {
    // First check if appointments table exists
    const [tables] = await db
      .promise()
      .query("SHOW TABLES LIKE 'appointments'");

    if (tables.length === 0) {
      return res.json({
        success: true,
        departmentDistribution: [], // Return empty array if no table
      });
    }

    // Check if department column exists
    const [columns] = await db
      .promise()
      .query("SHOW COLUMNS FROM appointments LIKE 'department'");

    if (columns.length === 0) {
      return res.json({
        success: true,
        departmentDistribution: [], // Return empty array if no department column
      });
    }

    // Get actual data
    const [results] = await db.promise().query(`
      SELECT 
        IFNULL(department, 'Other') as name, 
        COUNT(*) as value
      FROM appointments
      GROUP BY department
      ORDER BY value DESC
    `);

    res.json({
      success: true,
      departmentDistribution: results || [], // Ensure we always return an array
    });
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch department distribution data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getTodayAppointments = async (req, res) => {
  try {
    const [appointments] = await db.promise().query(`
      SELECT 
        a.id,
        p.full_name as patient_name,
        d.doctorfullname as doctor_name,
        a.department,
        a.appointment_time,
        a.status
      FROM appointments a
      JOIN patient p ON a.id = p.id
      JOIN doctor d ON a.doctor_id = d.id
      WHERE DATE(a.appointment_date) = CURDATE()
      ORDER BY a.appointment_time ASC
    `);

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's appointments",
    });
  }
};

module.exports = {
  getDashboardStats,
  getGraphData,
  getTodayAppointments,
};
