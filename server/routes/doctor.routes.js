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
router.put(
  "/admin/doctors/:id",
  asyncHandler(doctorController.updateDoctorById)
);
router.delete(
  "/admin/doctors/:id",
  asyncHandler(doctorController.deleteDoctorById)
);

// Updated password change route without auth middleware
router.post(
  "/doctor/change-password",
  asyncHandler(doctorController.changePassword)
);

router.get(
  "/getDoctorsByDepartment",
  asyncHandler(doctorController.getDoctorsByDepartment)
);

module.exports = router;
