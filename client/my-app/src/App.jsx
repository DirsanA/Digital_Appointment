import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientRegister from "./PatientRegister";
import Login from "./Login";

import Service from "./Service";
import DoctorLandingPage from "./DoctorLandingPage";
import AppointmentsContent from "./AppointmentsContent";
import AddAppointment from "./AddAppointment";
import PatientDashboard from "./PatientDashboard";
import BookAppointment from "./BookAppointment";
import AppointmentHistory from "./AppointmentHistory";
import AdminDashboard from "./AdminDashboard";
import LandingPage from "./LandingPage";
import OurDoctors from "./OurDoctors";
import Doctors from "./OurDoctors";
import PatientsContent from "./PatientsContent";
import Department from "./Department";
import AboutUs from "./About";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/About" element={<AboutUs />} />
        <Route path="/BookAppointment" element={<BookAppointment />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/patient-login" element={<Login />} />{" "}
        <Route path="/doctor-landingPage" element={<DoctorLandingPage />} />
        <Route path="appointment" element={<AppointmentsContent />} />
        <Route path="AppointmentHistory" element={<AppointmentHistory />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/Patient-Dashbord" element={<PatientDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/OurDoctors" element={<OurDoctors />} />
        <Route path="/AddAppointment" element={<AddAppointment />} />
        <Route path="/Doctors" element={<Doctors />} />
        <Route path="/PatientContent" element={<PatientsContent />} />
        <Route path="/Department" element={<Department />} />
      </Routes>
    </Router>
  );
};

export default App;
