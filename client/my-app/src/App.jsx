import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PatientRegister from "./components/patient/PatientRegister";
import Login from "./components/auth/Login";
import DoctorLandingPage from "./components/doctor/DoctorLandingPage";
import AppointmentsContent from "./components/doctor/AppointmentsContent";
import PatientDashboard from "./components/patient/PatientDashboard";
import BookAppointment from "./components/patient/BookAppointment";
import AdminDashboard from "./components/admin/AdminDashboard";
import LandingPage from "./components/home/LandingPage";
import OurDoctors from "./components/home/OurDoctors";
import ContactPage from "./components/home/ContactPage";
import About from "./components/home/About";
import Service from "./components/home/Service";
import Doctors from "./components/admin/Doctors";
import Appointments from "./components/admin/Appointments";
import AddDoctors from "./components/admin/AddDoctors";
import Departments from "./components/admin/Departments";
import AppointmentHistory from "./components/patient/AppointmentHistory";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
        <Route
          path="/patient-login"
          element={<Navigate to="/login" replace />}
        />
        <Route path="/admin/doctors" element={<AddDoctors />} />
        <Route path="/Appointments" element={<Appointments />} />
        <Route path="/Departments" element={<Departments />} />
        <Route path="/admin/getAllDoctors" element={<Doctors />} />
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
