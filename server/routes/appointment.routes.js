const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController.controller");

router.post("/appointment", appointmentController.bookAppointment);
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
