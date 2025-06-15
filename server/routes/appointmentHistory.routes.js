const express = require('express');
const router = express.Router();
const appointmentHistoryController = require('../controllers/appointmentHistoryController.controller');

// Add history to an appointment
router.post('/:appointmentId/history', appointmentHistoryController.addHistory);

// Get history for an appointment
router.get('/:appointmentId/history', appointmentHistoryController.getHistory);

// Get patient's history
router.get('/patient/:patientId/history', appointmentHistoryController.getPatientHistory);

// Get patient's history for admin view
router.get('/admin/patient/:patientId/history', appointmentHistoryController.getPatientHistoryForAdmin);

// Get all history (admin view)
router.get('/admin/history', appointmentHistoryController.getAllHistory);

// Get doctor's history
router.get('/doctor/:doctorId/history', appointmentHistoryController.getDoctorHistory);

// Update history
router.put('/history/:id', appointmentHistoryController.updateHistory);

// Delete history
router.delete('/history/:id', appointmentHistoryController.deleteHistory);

module.exports = router; 