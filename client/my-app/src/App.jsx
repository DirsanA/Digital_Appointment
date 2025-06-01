import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PatientRegister from "./PatientRegister";
import Login from "./Login";
import DoctorLandingPage from "./DoctorLandingPage";
import AppointmentsContent from "./AppointmentsContent";
import PatientDashboard from "./PatientDashboard";
import BookAppointment from "./BookAppointment";
import AdminDashboard from "./AdminDashboard";
import LandingPage from "./LandingPage";
import OurDoctors from "./OurDoctors";
import ContactPage from "./ContactPage";
import About from "./About";
import Service from "./Service";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import AddDoctors from "./AddDoctors";
import Departments from "./Departments";
import AppointmentHistory from "./AppointmentHistory";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/OurDoctors" element={<OurDoctors />} />
        <Route path="/ContactPage" element={<ContactPage />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient-login" element={<Navigate to="/login" replace />} />
        <Route path="/admin/doctors" element={<AddDoctors />} />
        <Route path="/Appointments" element={<Appointments />} />
        <Route path="/Departments" element={<Departments />} />
        <Route path="/admin/getAllDoctors" element={<Doctors />} />
        {/* <Route path="AdminDashboard" element={<AdminDashboard />} /> */}
        <Route path="appointment" element={<AppointmentsContent />} />
        <Route path="/BookAppointment" element={<BookAppointment />} />
        <Route path="/AppointmentHistory" element={<AppointmentHistory />} />

        {/* Protected Routes - Only these require authentication */}
        <Route
          path="/doctor-landingPage"
          element={
            <ProtectedRoute>
              <DoctorLandingPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="AdminDashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Patient-Dashbord"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
