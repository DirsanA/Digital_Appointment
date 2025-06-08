const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController.controller");

// Simple time validation function
const validateTimeFormat = (time) => {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
};

// Middleware to check time format
const checkAppointmentTime = (req, res, next) => {
  const { startTime, endTime } = req.body;

  if (startTime && !validateTimeFormat(startTime)) {
    return res
      .status(400)
      .json({ error: "Invalid startTime format. Use HH:MM in 24-hour format" });
  }

  if (endTime && !validateTimeFormat(endTime)) {
    return res
      .status(400)
      .json({ error: "Invalid endTime format. Use HH:MM in 24-hour format" });
  }

  next();
};

// Apply time validation to relevant routes
router.post(
  "/appointment",
  checkAppointmentTime,
  appointmentController.bookAppointment
);
router.put(
  "/appointment/:id",
  checkAppointmentTime,
  appointmentController.updateAppointment
);

// Original routes
router.get("/appointments", appointmentController.getAllAppointments);
router.patch(
  "/appointments/:id",
  appointmentController.updateAppointmentStatus
);
router.delete(
  "/appointment/:appointmentId",
  appointmentController.deleteAppointment
);

module.exports = router;
