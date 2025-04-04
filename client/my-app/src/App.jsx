import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import PatientRegister from "./PatientRegister";
import Login from "./Login";
import PatientDashboard from "./PatientDashboard";
import BookAppointment from "./BookAppointment";
import AppointmentHistory from "./AppointmentHistory"; // Import the new component
import AdminDashboard from "./AdminDashboard";
import Doctors from "./Doctors";
import AddDoctors from "./AddDoctors";
import Appointments  from "./Appointments";
import Departments from "./Department";
import About from "./About"
import Service from "./Service"
import OurDoctors from "./OurDoctors";
import AddAppointment from "./AddAppointment"
import Navbar from "./Navbar";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/About" element={<About />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/OurDoctors" element={<OurDoctors />} />
        <Route path="/AddAppointment" element={<AddAppointment />} />
        <Route path="/Patient-Dashbord" element={<PatientDashboard />} />
        <Route path="/BookAppointment" element={<BookAppointment />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Doctors" element={<Doctors />} />
        <Route path="/Appointments" element={<Appointments />} />
        <Route path="/Departments" element={<Departments/>} />
        <Route path="/AddDoctors" element={<AddDoctors />} />
        <Route path="/AppointmentHistory" element={<AppointmentHistory />} /> 
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/patient-login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
