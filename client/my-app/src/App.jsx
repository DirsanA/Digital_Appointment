import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage"; // ✅ Import added
import PatientRegister from "./PatientRegister";
import Login from "./Login";
import DoctorLandingPage from "./DoctorLandingPage";
import AppointmentsContent from "./AppointmentsContent";
import PatientDashboard from "./PatientDashboard";
import BookAppointment from "./BookAppointment";
import AppointmentHistory from "./AppointmentHistory";
import AdminDashboard from "./AdminDashboard";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/BookAppointment" element={<BookAppointment />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/patient-login" element={<Login />} />{" "}
        <Route path="/doctor-landingPage" element={<DoctorLandingPage />} />
        <Route path="appointment" element={<AppointmentsContent />} />
        <Route path="AppointmentHistory" element={<AppointmentHistory />} />
        <Route path="/Patient-Dashbord" element={<PatientDashboard />} />
        <Route path="AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
