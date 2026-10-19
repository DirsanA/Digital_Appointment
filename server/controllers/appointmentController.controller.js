const db = require("../config/db");

// ✅ Book an appointment d
// Book appointment
const bookAppointment = (req, res) => {
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

  const missingFields = Object.keys(requiredFields).filter(
    (field) => !req.body[field]
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields
        .map((f) => requiredFields[f])
        .join(", ")}`,
    });
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(appointment_date)) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format. Use YYYY-MM-DD",
    });
  }

  // Validate time format (HH:MM)
  if (!/^\d{2}:\d{2}$/.test(appointment_time)) {
    return res.status(400).json({
      success: false,
      message: "Invalid time format. Use HH:MM",
    });
  }

  const sql = `
    INSERT INTO appointments 
    (patient_name, department, appointment_date, patient_email, 
     doctor_id, appointment_time, patient_phone, patient_gender,
     doctorname, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
  `;

  db.query(
    sql,
    [
      patient_name,
      department,
      appointment_date,
      patient_email,
      doctor_id,
      appointment_time,
      patient_phone,
      patient_gender,
      doctorname,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting appointment:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to book appointment",
          error:
            err.code === "ER_NO_DEFAULT_FOR_FIELD"
              ? "Missing required field in database"
              : err.sqlMessage,
        });
      }

      res.status(201).json({
        success: true,
        message: "✅ Appointment booked successfully",
        appointmentId: result.insertId,
        appointmentDetails: {
          patient_name,
          doctorname,
          appointment_date,
          appointment_time,
        },
      });
    }
  );
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

    // Add WHERE clause if patient_email is provided
    if (patient_email) {
      sql += ` WHERE a.patient_email = ?`;
    }

    sql += ` ORDER BY a.appointment_date DESC`;

    const [appointments] = await db
      .promise()
      .query(sql, patient_email ? [patient_email] : []);

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

// ✅ Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      success: false,
      message: "Appointment ID and status are required",
    });
  }

  const validStatuses = ["pending", "accepted", "cancelled", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
      validStatuses,
    });
  }

  try {
    const conn = db.promise();
    await conn.beginTransaction();

    const checkSql = `SELECT id FROM appointments WHERE id = ? FOR UPDATE`;
    const [existingAppointment] = await conn.query(checkSql, [id]);

    // check it out
    if (existingAppointment.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const updateSql = `UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?`;
    const [result] = await conn.query(updateSql, [status, id]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(500).json({
        success: false,
        message: "Failed to update appointment status",
      });
    }

    const getSql = `SELECT * FROM appointments WHERE id = ?`;
    const [updatedAppointment] = await conn.query(getSql, [id]);

    await conn.commit();

    res.status(200).json({
      success: true,
      message: `Appointment status updated to '${status}' successfully`,
      data: updatedAppointment[0],
    });
  } catch (err) {
    await db.promise().rollback();
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// ✅ Delete an appointment
const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const sql = `DELETE FROM appointments WHERE id = ?`;
    const [result] = await db.promise().query(sql, [appointmentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
    });
  }
};

// controllers/appointmentController.js

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { department, doctor_id, appointment_date, appointment_time } =
    req.body;

  // Validate required fields
  if (!department || !doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({
      success: false,
      message: "Department, Doctor ID, Date, and Time are required",
    });
  }

  // Format validation (optional but helpful)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!dateRegex.test(appointment_date)) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format. Use YYYY-MM-DD",
    });
  }

  if (!timeRegex.test(appointment_time)) {
    return res.status(400).json({
      success: false,
      message: "Invalid time format. Use HH:MM (24-hour)",
    });
  }

  try {
    const sql = `
      UPDATE appointments 
      SET department = ?, doctor_id = ?, appointment_date = ?, appointment_time = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const [result] = await db
      .promise()
      .query(sql, [
        department,
        doctor_id,
        appointment_date,
        appointment_time,
        id,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or no changes made",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment details updated successfully",
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: err.message,
    });
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
