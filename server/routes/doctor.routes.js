const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController.controller");

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Doctor routes
router.get(
  "/admin/getAllDoctors",
  asyncHandler(doctorController.getAllDoctors)
);
router.get("/admin/doctors/:id", asyncHandler(doctorController.getDoctorById));
router.post(
  "/admin/doctors",
  asyncHandler(doctorController.doctorRegistration)
);
router.put("/admin/doctors/:id", asyncHandler(doctorController.updateDoctor));
router.delete(
  "/admin/doctors/:id",
  asyncHandler(doctorController.deleteDoctor)
);

module.exports = router;
