const pool = require("../config/db");

// ✅ Book an appointment
const bookAppointment = async (req, res) => {
  const {
    patient_name,
    department,
    appointment_date,
    patient_email,
    doctor_id,
    appointment_time,
    patient_phone,
    patient_gender,
    doctorname,
  } = req.body;

  // Validate required fields
  const requiredFields = {
    patient_name: "Patient name",
    department: "Department",
    appointment_date: "Appointment date",
    patient_email: "Patient email",
    doctor_id: "Doctor ID",
    appointment_time: "Appointment time",
    patient_phone: "Patient phone",
    patient_gender: "Patient gender",
    doctorname: "Doctor name",
  };

  const missingFields = Object.keys(requiredFields).filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.map((f) => requiredFields[f]).join(", ")}`,
    });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(appointment_date)) {
    return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD" });
  }
  if (!/^\d{2}:\d{2}$/.test(appointment_time)) {
    return res.status(400).json({ success: false, message: "Invalid time format. Use HH:MM" });
  }

  try {
    const sql = `
      INSERT INTO appointments 
      (patient_name, department, appointment_date, patient_email, 
       doctor_id, appointment_time, patient_phone, patient_gender,
       doctorname, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', NOW(), NOW())
      RETURNING id
    `;

    const result = await pool.query(sql, [
      patient_name,
      department,
      appointment_date,
      patient_email,
      doctor_id,
      appointment_time,
      patient_phone,
      patient_gender,
      doctorname,
    ]);

    res.status(201).json({
      success: true,
      message: "✅ Appointment booked successfully",
      appointmentId: result.rows[0].id,
      appointmentDetails: { patient_name, doctorname, appointment_date, appointment_time },
    });
  } catch (err) {
    console.error("❌ Error inserting appointment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
      error: err.code === "23502" ? "Missing required field in database" : err.message,
    });
  }
};

// ✅ Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const { patient_email } = req.query;

    let sql = `
      SELECT 
        a.*,
        d.doctorfullname
      FROM appointments a
      LEFT JOIN doctor d ON a.doctor_id = d.id
    `;

    const params = [];
    if (patient_email) {
      sql += ` WHERE a.patient_email = $1`;
      params.push(patient_email);
    }

    sql += ` ORDER BY a.appointment_date DESC`;

    const result = await pool.query(sql, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};

// ✅ Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ success: false, message: "Appointment ID and status are required" });
  }

  const validStatuses = ["pending", "accepted", "cancelled", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value", validStatuses });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const checkResult = await client.query(`SELECT id FROM appointments WHERE id = $1 FOR UPDATE`, [id]);
    if (checkResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const updateResult = await client.query(
      `UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, id]
    );

    if (updateResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, message: "Failed to update appointment status" });
    }

    const getResult = await client.query(`SELECT * FROM appointments WHERE id = $1`, [id]);
    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: `Appointment status updated to '${status}' successfully`,
      data: getResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  } finally {
    client.release();
  }
};

// ✅ Delete an appointment
const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const result = await pool.query(`DELETE FROM appointments WHERE id = $1`, [appointmentId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Failed to delete appointment" });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { department, doctor_id, appointment_date, appointment_time } = req.body;

  if (!department || !doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({
      success: false,
      message: "Department, Doctor ID, Date, and Time are required",
    });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!dateRegex.test(appointment_date)) {
    return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD" });
  }
  if (!timeRegex.test(appointment_time)) {
    return res.status(400).json({ success: false, message: "Invalid time format. Use HH:MM (24-hour)" });
  }

  try {
    const result = await pool.query(
      `UPDATE appointments 
       SET department = $1, doctor_id = $2, appointment_date = $3, appointment_time = $4, updated_at = NOW()
       WHERE id = $5`,
      [department, doctor_id, appointment_date, appointment_time, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found or no changes made" });
    }

    res.status(200).json({ success: true, message: "Appointment details updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Failed to update appointment", error: err.message });
  }
};

// ⛳ Export all controllers
module.exports = {
  updateAppointment,
  bookAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};
