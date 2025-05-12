const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController.controller");

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  if (typeof fn !== "function") {
    console.error("Route handler is not a function:", fn);
    return next(new Error("Route handler is not a function"));
  }
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

// FIX THIS ONE TOO (wrap it in asyncHandler)
router.get(
  "/getDoctorsByDepartment",
  asyncHandler(doctorController.getDoctorsByDepartment)
);

module.exports = router;
