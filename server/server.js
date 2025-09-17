const express = require("express");
const cors = require("cors");
const path = require("path");
// const path = require("path");
const app = express();
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const departmentRoutes = require("./routes/department.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const loginRoutes = require("./routes/login.routes");
const dashboardRoutes = require("./routes/dashboardRoutes.routes");
const appointmentHistoryRoutes = require("./routes/appointmentHistory.routes");

// Mount routes
app.use("/", loginRoutes);
app.use("/", patientRoutes);
app.use("/", doctorRoutes);
app.use("/", departmentRoutes);
app.use("/", appointmentRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/appointments", appointmentHistoryRoutes);

// Serve client build if exists
const clientDistPath = path.join(__dirname, "../client/my-app/dist");
app.use(express.static(clientDistPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/appointments")) return next();
  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) next();
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});


// const express = require("express");
// const cors = require("cors");
// const app = express();
// require("dotenv").config();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Import routes
// const patientRoutes = require("./routes/patient.routes");
// const doctorRoutes = require("./routes/doctor.routes");
// const departmentRoutes = require("./routes/department.routes");
// const appointmentRoutes = require("./routes/appointment.routes");
// const loginRoutes = require("./routes/login.routes");
// const dashboardRoutes = require("./routes/dashboardRoutes.routes");
// const appointmentHistoryRoutes = require("./routes/appointmentHistory.routes");

// // Mount routes
// app.use("/", loginRoutes);
// app.use("/", patientRoutes);
// app.use("/", doctorRoutes);
// app.use("/", departmentRoutes);
// app.use("/", appointmentRoutes);
// app.use("/api", dashboardRoutes);
// app.use("/api/appointments", appointmentHistoryRoutes);

// // Error handling
// app.use((err, req, res, next) => {
//   console.error("Server error:", err.stack);
//   res.status(500).json({
//     success: false,
//     message: "Internal server error",
//     error: process.env.NODE_ENV === "development" ? err.message : undefined,
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });
