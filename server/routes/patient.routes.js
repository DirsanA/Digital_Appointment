const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientControllers.controller");

// Registration with OTP flow
router.post("/patient/register", patientController.registerPatient);
router.post("/patient/verify-otp", patientController.verifyOTP);
router.post("/patient/resend-otp", patientController.resendOTP);

// Patient management
router.get("/patient", patientController.getAllPatients);
router.get("/patient/profile", patientController.getCurrentPatient);
router.get("/patient/:id", patientController.getPatientById);
router.put("/patient/:id", patientController.updatePatientById);
router.delete("/patient/:id", patientController.deletePatientById);

module.exports = router;
