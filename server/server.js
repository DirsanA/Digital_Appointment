const express = require("express");
const cors = require("cors");
const app = express();

// Import routes
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const departmentRoutes = require("./routes/department.routes");
const appointment = require("./routes/appointment.routes");
const loginRoutes = require("./routes/login.routes");

// Middleware
app.use(express.json());
app.use(cors());

// Mount login routes first to ensure they take precedence
app.use("/", loginRoutes);

// Use other routes
app.use("/", patientRoutes);
app.use("/", doctorRoutes);
app.use("/", departmentRoutes);
app.use("/", appointment);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
