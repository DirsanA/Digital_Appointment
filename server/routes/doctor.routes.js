const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController.controller");
const { upload } = require("../config/cloudinaryConfig");

// Doctor routes
router.get("/admin/getAllDoctors", doctorController.getAllDoctors);
router.get("/admin/doctors/:id", doctorController.getDoctorById);
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
router.delete("/admin/doctors/:id", doctorController.deleteDoctorById);
router.post("/doctor/change-password", doctorController.changePassword);
router.get("/getDoctorsByDepartment", doctorController.getDoctorsByDepartment);

module.exports = router;
