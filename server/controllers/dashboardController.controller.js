const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const [patients, doctors, appointments, todayAppointments] = await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM patient"),
      pool.query("SELECT COUNT(*) as count FROM doctor"),
      pool.query("SELECT COUNT(*) as count FROM appointments"),
      pool.query("SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date) = CURRENT_DATE"),
    ]);

    // Get status distribution
    const statusResult = await pool.query(`
      SELECT 
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
      GROUP BY status
    `);

    res.json({
      success: true,
      data: {
        totalPatients: patients.rows[0].count,
        totalDoctors: doctors.rows[0].count,
        totalAppointments: appointments.rows[0].count,
        todayAppointments: todayAppointments.rows[0].count,
        statusDistribution: statusResult.rows,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};

const getGraphData = async (req, res) => {
  try {
    // Check if appointments table exists in PostgreSQL
    const tableCheck = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'appointments'
      ) as exists`
    );

    if (!tableCheck.rows[0].exists) {
      return res.json({ success: true, departmentDistribution: [] });
    }

    // Check if department column exists
    const columnCheck = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'department'
      ) as exists`
    );

    if (!columnCheck.rows[0].exists) {
      return res.json({ success: true, departmentDistribution: [] });
    }

    const result = await pool.query(`
      SELECT 
        COALESCE(department, 'Other') as name, 
        COUNT(*) as value
      FROM appointments
      GROUP BY department
      ORDER BY value DESC
    `);

    res.json({ success: true, departmentDistribution: result.rows || [] });
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
    const result = await pool.query(`
      SELECT 
        a.*,
        d.doctorfullname as doctor_name,
        d.department as doctor_department,
        TO_CHAR(a.appointment_date, 'YYYY-MM-DD') as formatted_date
      FROM 
        appointments a
        LEFT JOIN doctor d ON a.doctor_id = d.id
      WHERE 
        DATE(a.appointment_date) = CURRENT_DATE
      ORDER BY 
        a.appointment_time ASC
    `);

    console.log("Today's appointments query executed");
    console.log("Current date:", new Date().toISOString().split("T")[0]);
    console.log("Number of appointments found:", result.rows.length);

    const formattedAppointments = result.rows.map((apt) => ({
      id: apt.id,
      patient_name: apt.patient_name,
      doctor_name: apt.doctor_name || "Not Assigned",
      appointment_date: apt.formatted_date,
      appointment_time: apt.appointment_time,
      department: apt.doctor_department || apt.department || "General",
      status: apt.status || "scheduled",
      patient_id: apt.patient_id,
    }));

    res.json({ success: true, data: formattedAppointments });
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's appointments",
      error: error.message,
    });
  }
};

// Get all appointments for Excel export
const getAllAppointmentsForExcel = async (req, res) => {
  try {
    // Check if appointments table exists
    const tableCheck = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'appointments'
      ) as exists`
    );

    if (!tableCheck.rows[0].exists) {
      return res.json({ success: true, data: [] });
    }

    const { year } = req.query;
    let query = `
      SELECT 
        a.id,
        a.patient_name,
        a.patient_email,
        a.patient_phone,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.created_at,
        a.updated_at,
        d.doctorfullname as doctor_name,
        d.department as doctor_department,
        d.email as doctor_email,
        d.contact as doctor_contact
      FROM 
        appointments a
        LEFT JOIN doctor d ON a.doctor_id = d.id
    `;

    const params = [];
    if (year) {
      query += ` WHERE EXTRACT(YEAR FROM a.appointment_date) = $1`;
      params.push(year);
    }

    query += ` ORDER BY a.appointment_date DESC, a.appointment_time ASC`;

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching all appointments for Excel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments data",
      error: error.message,
    });
  }
};

// Get all doctors for Excel export
const getAllDoctorsForExcel = async (req, res) => {
  try {
    const tableCheck = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'doctor'
      ) as exists`
    );

    if (!tableCheck.rows[0].exists) {
      return res.json({ success: true, data: [] });
    }

    const result = await pool.query(`
      SELECT 
        id,
        doctorfullname as doctor_name,
        email,
        department,
        contact,
        experiance as experience,
        photo_url
      FROM 
        doctor
      ORDER BY 
        doctorfullname ASC
    `);

    console.log("Doctors data for Excel:", result.rows.length, "doctors found");
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching all doctors for Excel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors data",
      error: error.message,
    });
  }
};

// Get all patients for Excel export
const getAllPatientsForExcel = async (req, res) => {
  try {
    const tableCheck = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'patient'
      ) as exists`
    );

    if (!tableCheck.rows[0].exists) {
      return res.json({ success: true, data: [] });
    }

    const result = await pool.query(`
      SELECT 
        id,
        full_name as patient_name,
        email,
        phone
      FROM 
        patient
      ORDER BY 
        full_name ASC
    `);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching all patients for Excel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients data",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getGraphData,
  getTodayAppointments,
  getAllAppointmentsForExcel,
  getAllDoctorsForExcel,
  getAllPatientsForExcel,
};
