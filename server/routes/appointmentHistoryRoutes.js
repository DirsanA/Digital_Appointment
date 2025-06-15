const express = require('express');
const router = express.Router();
const appointmentHistoryController = require('../controllers/appointmentHistoryController');

// Add history to an appointment
router.post('/:appointmentId/history', appointmentHistoryController.addHistory);

// Get history for an appointment
router.get('/:appointmentId/history', appointmentHistoryController.getHistory);

// Update history
router.put('/history/:id', appointmentHistoryController.updateHistory);

// Delete history
router.delete('/history/:id', appointmentHistoryController.deleteHistory);

module.exports = router; 