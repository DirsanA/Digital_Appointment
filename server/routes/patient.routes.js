const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientControllers.controller");

router.post("/patient", patientController.registerPatient);
router.get("/patient", patientController.getAllPatients);
router.get("/patient/profile", patientController.getCurrentPatient);
router.get("/patient/:id", patientController.getPatientById);

module.exports = router;
