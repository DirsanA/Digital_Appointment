const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientControllers.controller");
router.post("/patient", patientController.registerPatient);

module.exports = router;
