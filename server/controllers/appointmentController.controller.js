const db = require("../config/db"); // Database connection

// Book appointment
exports.bookAppointment = (req, res) => {
  const {
    patient_name,
    department,
    appointment_date,
    patient_email,
    doctor_id,
    appointment_time,
    patient_phone,
    patient_gender,
  } = req.body;

  const sql = `
    INSERT INTO appointments 
    (patient_name, department, appointment_date, patient_email, doctor_id, appointment_time, patient_phone, patient_gender, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      "pending", // Default status when booking
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting appointment:", err);
        return res.status(500).json({ message: "Failed to book appointment" });
      }
      res.status(201).json({
        message: "Appointment booked successfully",
        appointmentId: result.insertId,
      });
    }
  );
};

// Fetch all appointments
exports.getAllAppointments = (req, res) => {
  const sql = `SELECT * FROM appointments`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json({ message: "Failed to fetch appointments" });
    }
    res.status(200).json(results);
  });
};

// Update appointment status (Approve / Decline)
exports.updateAppointmentStatus = (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const sql = `UPDATE appointments SET status = ? WHERE id = ?`;

  db.query(sql, [status, appointmentId], (err, result) => {
    if (err) {
      console.error("Error updating appointment status:", err);
      return res.status(500).json({ message: "Failed to update status" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: `Appointment ${status} successfully` });
  });
};

exports.updateAppointment = (req, res) => {
  const { appointmentId } = req.params;

  const {
    patient_name,
    department,
    doctor_id,
    appointment_date,
    appointment_time,
    status,
  } = req.body;

  console.log(appointment_date);

  const sql = `
      UPDATE appointments SET  patient_name = ?,  department = ?,  doctor_id = ?, appointment_date = ?, appointment_time = ?, status = ?
      WHERE id = ?
    `;

  const values = [
    patient_name,
    department,
    doctor_id,
    appointment_date,
    appointment_time,
    status,
    appointmentId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating appointment:", err);
      return res.status(500).json({ message: "Failed to update appointment" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment updated successfully" });
  });
};

exports.deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const [result] = await db
      .promise()
      .query(`DELETE FROM appointments WHERE id = ?`, [appointmentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
};
