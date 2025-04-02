import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage"; // ✅ Import added
import PatientRegister from "./PatientRegister";
import Login from "./Login";
import DoctorLandingPage from "./DoctorLandingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/patient-login" element={<Login />} />{" "}
        <Route path="/doctor-landingPage" element={<DoctorLandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
