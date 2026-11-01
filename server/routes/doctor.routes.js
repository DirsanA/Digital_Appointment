const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController.controller");
const { upload } = require("../config/cloudinaryConfig");

// Doctor routes
router.get("/admin/getAllDoctors", doctorController.getAllDoctors);
router.get("/admin/doctors/:id", doctorController.getDoctorById);
router.get("/doctor/:id", doctorController.getDoctorById); // Compatibility alias
router.post(
  "/admin/doctors",
  upload.single("photo"),
  doctorController.doctorRegistration
);
router.put(
  "/admin/doctors/:id",
  upload.single("photo"),
  doctorController.updateDoctorById
);
router.put(
  "/doctor/:id",
  upload.single("photo"),
  doctorController.updateDoctorById
); // Compatibility alias
router.put(
  "/admin/doctors/upload-photo/:id",
  upload.single("photo"),
  doctorController.updateDoctorById
); // For DoctorProfile.jsx photo upload
router.delete("/admin/doctors/:id", doctorController.deleteDoctorById);
router.post("/doctor/change-password", doctorController.changePassword);
router.get("/getDoctorsByDepartment", doctorController.getDoctorsByDepartment);

module.exports = router;
