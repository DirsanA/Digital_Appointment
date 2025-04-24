const express = require("express");
const cors = require("cors");
const app = express();

// Import routes
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");

// Middleware
app.use(express.json());
app.use(cors());

// Use routes
app.use("/", patientRoutes);
app.use("/", doctorRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
