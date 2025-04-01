import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage"; // ✅ Import added
import PatientRegister from "./PatientRegister";
import PatientLogin from "./PatientLogin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/patient-login" element={<PatientLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
