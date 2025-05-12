//Routes
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController.controller");

router.post("/appointment", appointmentController.bookAppointment);
router.get("/appointments", appointmentController.getAllAppointments);
router.delete(
  "/appointment/:appointmentId",
  appointmentController.deleteAppointment
);
router.put(
  "/appointment/:appointmentId",
  appointmentController.updateAppointment
);
router.put(
  "/appointment/:appointmentId",
  appointmentController.updateAppointmentStatus
);

module.exports = router;
