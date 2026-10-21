const pool = require('../config/db');

const appointmentHistoryController = {
    // Add history to an appointment
    addHistory: async (req, res) => {
        const appointmentId = req.params.appointmentId;
        const {
            prescription,
            diagnosis,
            medicine_name,
            medicine_dosage,
            medicine_frequency,
            medicine_duration,
            next_appointment_date,
            next_appointment_time
        } = req.body;

        try {
            // First get the appointment details with patient information
            const appointmentResult = await pool.query(
                'SELECT a.*, p.id as patient_id FROM appointments a JOIN patient p ON a.patient_email = p.email WHERE a.id = $1',
                [appointmentId]
            );

            if (appointmentResult.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Appointment not found' });
            }

            const appointment = appointmentResult.rows[0];

            // Insert the history
            const insertResult = await pool.query(
                `INSERT INTO appointment_history 
                 (appointment_id, patient_id, patient_name, prescription, diagnosis,
                  medicine_name, medicine_dosage, medicine_frequency, medicine_duration,
                  next_appointment_date, next_appointment_time, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
                 RETURNING id`,
                [
                    appointmentId,
                    appointment.patient_id,
                    appointment.patient_name,
                    prescription || null,
                    diagnosis || null,
                    medicine_name || null,
                    medicine_dosage || null,
                    medicine_frequency || null,
                    medicine_duration || null,
                    next_appointment_date || null,
                    next_appointment_time || null,
                ]
            );

            // Update appointment status to completed (non-blocking)
            pool.query(
                'UPDATE appointments SET status = $1 WHERE id = $2',
                ['completed', appointmentId]
            ).catch((err) => console.error('Error updating appointment status:', err));

            res.status(201).json({
                success: true,
                message: 'History added successfully',
                data: {
                    id: insertResult.rows[0].id,
                    appointment_id: appointmentId,
                    patient_id: appointment.patient_id,
                    patient_name: appointment.patient_name,
                    prescription: prescription || null,
                    diagnosis: diagnosis || null,
                    medicine_name: medicine_name || null,
                    medicine_dosage: medicine_dosage || null,
                    medicine_frequency: medicine_frequency || null,
                    medicine_duration: medicine_duration || null,
                    next_appointment_date: next_appointment_date || null,
                    next_appointment_time: next_appointment_time || null,
                }
            });
        } catch (err) {
            console.error('Error adding history:', err);
            res.status(500).json({ success: false, message: 'Error adding history' });
        }
    },

    // Get history for an appointment
    getHistory: async (req, res) => {
        try {
            const { appointmentId } = req.params;
            const result = await pool.query(`
                SELECT 
                    ah.*,
                    a.appointment_date,
                    a.appointment_time,
                    d.doctorfullname as doctor_name,
                    d.department,
                    p.phone as patient_phone,
                    p.email as patient_email
                FROM appointment_history ah
                JOIN appointments a ON ah.appointment_id = a.id
                JOIN doctor d ON a.doctor_id = d.id
                JOIN patient p ON ah.patient_id = p.id
                WHERE ah.appointment_id = $1
                ORDER BY ah.created_at DESC
            `, [appointmentId]);

            res.json({ success: true, history: result.rows });
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch history', error: error.message });
        }
    },

    // Get patient's history
    getPatientHistory: async (req, res) => {
        try {
            const { patientId } = req.params;
            const result = await pool.query(`
                SELECT 
                    ah.*,
                    a.appointment_date,
                    a.appointment_time,
                    d.doctorfullname as doctor_name,
                    d.department,
                    p.phone as patient_phone,
                    p.email as patient_email
                FROM appointment_history ah
                JOIN appointments a ON ah.appointment_id = a.id
                JOIN doctor d ON a.doctor_id = d.id
                JOIN patient p ON ah.patient_id = p.id
                WHERE ah.patient_id = $1
                ORDER BY ah.created_at DESC
            `, [patientId]);

            res.json({ success: true, history: result.rows });
        } catch (error) {
            console.error('Error fetching patient history:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch patient history', error: error.message });
        }
    },

    // Get all history (admin view)
    getAllHistory: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT 
                    ah.*,
                    a.appointment_date,
                    a.appointment_time,
                    d.doctorfullname as doctor_name,
                    d.department,
                    p.phone as patient_phone,
                    p.email as patient_email
                FROM appointment_history ah
                JOIN appointments a ON ah.appointment_id = a.id
                JOIN doctor d ON a.doctor_id = d.id
                JOIN patient p ON ah.patient_id = p.id
                ORDER BY ah.created_at DESC
            `);

            res.json({ success: true, history: result.rows });
        } catch (error) {
            console.error('Error fetching all history:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch history', error: error.message });
        }
    },

    // Get doctor's history
    getDoctorHistory: async (req, res) => {
        try {
            const { doctorId } = req.params;
            const result = await pool.query(`
                SELECT 
                    ah.*,
                    a.appointment_date,
                    a.appointment_time,
                    p.full_name as patient_name,
                    p.phone as patient_phone,
                    p.email as patient_email
                FROM appointment_history ah
                JOIN appointments a ON ah.appointment_id = a.id
                JOIN patient p ON ah.patient_id = p.id
                WHERE a.doctor_id = $1
                ORDER BY ah.created_at DESC
            `, [doctorId]);

            res.json({ success: true, history: result.rows });
        } catch (error) {
            console.error('Error fetching doctor history:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch doctor history', error: error.message });
        }
    },

    // Get patient history for admin view
    getPatientHistoryForAdmin: async (req, res) => {
        try {
            const { patientId } = req.params;
            const result = await pool.query(`
                SELECT 
                    ah.*,
                    a.appointment_date,
                    a.appointment_time,
                    d.doctorfullname as doctor_name,
                    d.department,
                    p.full_name as patient_name,
                    p.phone as patient_phone,
                    p.email as patient_email,
                    p.address as patient_address,
                    p.gender as patient_gender,
                    p.age as patient_age
                FROM appointment_history ah
                JOIN appointments a ON ah.appointment_id = a.id
                JOIN doctor d ON a.doctor_id = d.id
                JOIN patient p ON ah.patient_id = p.id
                WHERE ah.patient_id = $1
                ORDER BY ah.created_at DESC
            `, [patientId]);

            res.json({ success: true, history: result.rows });
        } catch (error) {
            console.error('Error fetching patient history for admin:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch patient history', error: error.message });
        }
    },

    // Update history
    updateHistory: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                prescription,
                diagnosis,
                medicine_name,
                medicine_dosage,
                medicine_frequency,
                medicine_duration,
                next_appointment_date,
                next_appointment_time
            } = req.body;

            await pool.query(`
                UPDATE appointment_history 
                SET prescription = $1, 
                    diagnosis = $2, 
                    medicine_name = $3,
                    medicine_dosage = $4, 
                    medicine_frequency = $5, 
                    medicine_duration = $6,
                    next_appointment_date = $7, 
                    next_appointment_time = $8
                WHERE id = $9
            `, [
                prescription || null,
                diagnosis || null,
                medicine_name || null,
                medicine_dosage || null,
                medicine_frequency || null,
                medicine_duration || null,
                next_appointment_date || null,
                next_appointment_time || null,
                id
            ]);

            res.json({ success: true, message: 'History updated successfully' });
        } catch (error) {
            console.error('Error updating history:', error);
            res.status(500).json({ success: false, message: 'Failed to update history', error: error.message });
        }
    },

    // Delete history
    deleteHistory: async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query('DELETE FROM appointment_history WHERE id = $1', [id]);
            res.json({ success: true, message: 'History deleted successfully' });
        } catch (error) {
            console.error('Error deleting history:', error);
            res.status(500).json({ success: false, message: 'Failed to delete history', error: error.message });
        }
    }
};

module.exports = appointmentHistoryController;