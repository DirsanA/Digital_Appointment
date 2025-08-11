const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController.controller");

// Dashboard routes
router.get("/dashboard/stats", dashboardController.getDashboardStats);
router.get("/dashboard/graph-data", dashboardController.getGraphData);
router.get("/dashboard/today", dashboardController.getTodayAppointments);

// Excel export routes
router.get("/dashboard/excel/appointments", dashboardController.getAllAppointmentsForExcel);
router.get("/dashboard/excel/doctors", dashboardController.getAllDoctorsForExcel);
router.get("/dashboard/excel/patients", dashboardController.getAllPatientsForExcel);

module.exports = router;
