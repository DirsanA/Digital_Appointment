const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController.controller");

// Dashboard routes
router.get("/dashboard/stats", dashboardController.getDashboardStats);
router.get("/dashboard/graph-data", dashboardController.getGraphData);
router.get("/dashboard/today", dashboardController.getTodayAppointments);

module.exports = router;
