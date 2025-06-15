const db = require('../config/db');

const appointmentHistoryController = {
    // Add history to an appointment
    addHistory: (req, res) => {
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

        // First get the appointment details with patient information
        db.query(
            'SELECT a.*, p.id as patient_id FROM appointments a JOIN patient p ON a.patient_email = p.email WHERE a.id = ?',
            [appointmentId],
            (err, appointmentResults) => {
                if (err) {
                    console.error('Error fetching appointment:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Error fetching appointment details'
                    });
                }

                if (appointmentResults.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Appointment not found'
                    });
                }

                const appointment = appointmentResults[0];

                // Now insert the history
                const historyData = {
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
                    created_at: new Date()
                };

                db.query(
                    'INSERT INTO appointment_history SET ?',
                    historyData,
                    (err, result) => {
                        if (err) {
                            console.error('Error adding history:', err);
                            return res.status(500).json({
                                success: false,
                                message: 'Error adding history'
                            });
                        }

                        // Update appointment status to completed
                        db.query(
                            'UPDATE appointments SET status = ? WHERE id = ?',
                            ['completed', appointmentId],
                            (updateErr) => {
                                if (updateErr) {
                                    console.error('Error updating appointment status:', updateErr);
                                }
                            }
                        );

                        res.status(201).json({
                            success: true,
                            message: 'History added successfully',
                            data: {
                                id: result.insertId,
                                ...historyData
                            }
                        });
                    }
                );
            }
        );
    },

    // Get history for an appointment
    getHistory: (req, res) => {
        try {
            const { appointmentId } = req.params;
            const query = `
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
                WHERE ah.appointment_id = ?
                ORDER BY ah.created_at DESC
            `;
            
            db.query(query, [appointmentId], (err, history) => {
                if (err) {
                    console.error('Error fetching history:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to fetch history',
                        error: err.message
                    });
                }
                res.json({ success: true, history });
            });
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch history',
                error: error.message
            });
        }
    },

    // Get patient's history
    getPatientHistory: (req, res) => {
        try {
            const { patientId } = req.params;
            const query = `
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
                WHERE ah.patient_id = ?
                ORDER BY ah.created_at DESC
            `;
            
            db.query(query, [patientId], (err, history) => {
                if (err) {
                    console.error('Error fetching patient history:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to fetch patient history',
                        error: err.message
                    });
                }
                res.json({ success: true, history });
            });
        } catch (error) {
            console.error('Error fetching patient history:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch patient history',
                error: error.message
            });
        }
    },

    // Get all history (admin view)
    getAllHistory: (req, res) => {
        try {
            const query = `
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
            `;
            
            db.query(query, (err, history) => {
                if (err) {
                    console.error('Error fetching all history:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to fetch history',
                        error: err.message
                    });
                }
                res.json({ success: true, history });
            });
        } catch (error) {
            console.error('Error fetching all history:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch history',
                error: error.message
            });
        }
    },

    // Get doctor's history
    getDoctorHistory: (req, res) => {
        try {
            const { doctorId } = req.params;
            const query = `
                SELECT 
                    ah.*,
                    a.appointment_date,
                    a.appointment_time,
                    p.name as patient_name,
                    p.phone as patient_phone,
                    p.email as patient_email
                FROM appointment_history ah
                JOIN appointments a ON ah.appointment_id = a.id
                JOIN patient p ON ah.patient_id = p.id
                WHERE a.doctor_id = ?
                ORDER BY ah.created_at DESC
            `;
            
            db.query(query, [doctorId], (err, history) => {
                if (err) {
                    console.error('Error fetching doctor history:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to fetch doctor history',
                        error: err.message
                    });
                }
                res.json({ success: true, history });
            });
        } catch (error) {
            console.error('Error fetching doctor history:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch doctor history',
                error: error.message
            });
        }
    },

    // Get patient history for admin view
    getPatientHistoryForAdmin: (req, res) => {
        try {
            const { patientId } = req.params;
            const query = `
                SELECT 
                    ah.*,
                    a.appointment_date,
                    a.appointment_time,
                    d.doctorfullname as doctor_name,
                    d.department,
                    p.name as patient_name,
                    p.phone as patient_phone,
                    p.email as patient_email,
                    p.address as patient_address,
                    p.gender as patient_gender,
                    p.age as patient_age
                FROM appointment_history ah
                JOIN appointments a ON ah.appointment_id = a.id
                JOIN doctor d ON a.doctor_id = d.id
                JOIN patient p ON ah.patient_id = p.id
                WHERE ah.patient_id = ?
                ORDER BY ah.created_at DESC
            `;
            
            db.query(query, [patientId], (err, history) => {
                if (err) {
                    console.error('Error fetching patient history for admin:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to fetch patient history',
                        error: err.message
                    });
                }
                res.json({ success: true, history });
            });
        } catch (error) {
            console.error('Error fetching patient history for admin:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch patient history',
                error: error.message
            });
        }
    },

    // Update history
    updateHistory: (req, res) => {
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

            const query = `
                UPDATE appointment_history 
                SET prescription = ?, 
                    diagnosis = ?, 
                    medicine_name = ?,
                    medicine_dosage = ?, 
                    medicine_frequency = ?, 
                    medicine_duration = ?,
                    next_appointment_date = ?, 
                    next_appointment_time = ?
                WHERE id = ?
            `;

            const values = [
                prescription || null,
                diagnosis || null,
                medicine_name || null,
                medicine_dosage || null,
                medicine_frequency || null,
                medicine_duration || null,
                next_appointment_date || null,
                next_appointment_time || null,
                id
            ];

            db.query(query, values, (err) => {
                if (err) {
                    console.error('Error updating history:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to update history',
                        error: err.message
                    });
                }
                res.json({ success: true, message: 'History updated successfully' });
            });
        } catch (error) {
            console.error('Error updating history:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update history',
                error: error.message
            });
        }
    },

    // Delete history
    deleteHistory: (req, res) => {
        try {
            const { id } = req.params;
            const query = 'DELETE FROM appointment_history WHERE id = ?';
            
            db.query(query, [id], (err) => {
                if (err) {
                    console.error('Error deleting history:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to delete history',
                        error: err.message
                    });
                }
                res.json({ success: true, message: 'History deleted successfully' });
            });
        } catch (error) {
            console.error('Error deleting history:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete history',
                error: error.message
            });
        }
    }
};

module.exports = appointmentHistoryController; 