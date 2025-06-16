import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarPlus,
  FaHistory,
  FaUserCircle,
  FaPowerOff,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import bgImage from "/assets/b4.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientSidebar from "./PatientSidebar";

const BookAppointment = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointment, setAppointment] = useState({
    patientName: "",
    department: "",
    date: "",
    email: "",
    doctor: "",
    time: "",
    phone: "",
    gender: "",
    doctorname: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [patientData, setPatientData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const navigate = useNavigate();

  // Predefined departments
  const departments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/patient-login");
      return;
    }

    // Fetch patient details
    const fetchPatientDetails = async () => {
      try {
        const patientId = localStorage.getItem("patientId");
        if (!patientId) {
          throw new Error("Patient ID not found");
        }

        const response = await axios.get(
          `http://localhost:5000/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const patientDetails = response.data.patient;
          setPatientData({
            full_name: patientDetails.full_name,
            email: patientDetails.email,
            phone: patientDetails.phone,
          });
          setAppointment(prev => ({
            ...prev,
            patientName: patientDetails.full_name,
            email: patientDetails.email,
            phone: patientDetails.phone
          }));
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        toast.error("Failed to fetch patient details");
      }
    };

    fetchPatientDetails();
  }, [navigate]);

  // Fetch doctors when department changes
  useEffect(() => {
    const fetchDoctorsByDepartment = async () => {
      if (!appointment.department) {
        setDoctors([]);
        return;
      }

      try {
        setFetchingDoctors(true);
        const response = await axios.get(
          `http://localhost:5000/getDoctorsByDepartment?department=${appointment.department}`
        );

        if (response.data.success) {
          setDoctors(response.data.doctors || []);
        } else {
          throw new Error(response.data.message || "Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setFetchingDoctors(false);
      }
    };

    fetchDoctorsByDepartment();
  }, [appointment.department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    const selectedDoctor = doctors.find(
      (doctor) => doctor.id == selectedDoctorId
    );

    setAppointment((prev) => ({
      ...prev,
      doctor: selectedDoctorId,
      doctorname: selectedDoctor ? selectedDoctor.name : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/appointment",
        {
          patient_name: appointment.patientName,
          department: appointment.department,
          appointment_date: appointment.date,
          patient_email: appointment.email,
          doctor_id: appointment.doctor,
          appointment_time: appointment.time,
          patient_phone: appointment.phone,
          patient_gender: appointment.gender,
          doctorname: appointment.doctorname,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Appointment booked:", response.data);
        alert("Appointment booked successfully!");

        // Reset form
        setAppointment({
          patientName: patientData.full_name,
          department: "",
          date: "",
          email: appointment.email,
          doctor: "",
          time: "",
          phone: appointment.phone,
          gender: appointment.gender,
          doctorname: "",
        });
        setDoctors([]);
      } else {
        throw new Error(response.data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("patientId");
    setSidebarOpen(false);
    navigate("/");
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <ToastContainer />
      
      {/* Use the shared PatientSidebar component with proper patient data */}
      <PatientSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        patientData={patientData}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:mr-0 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div
            className="relative flex flex-col justify-center shadow-md mb-8 p-6 rounded-lg w-full h-48 text-white"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="font-bold text-blue-500 text-2xl">
              Welcome {patientData.full_name}
            </h2>
            <p className="mt-2 text-blue-500">
              Schedule your medical appointment with our specialists
            </p>
          </div>

          {/* Appointment Form */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="flex items-center mb-6 font-semibold text-gray-800 text-xl">
              <FaCalendarPlus className="mr-2 text-purple-600" />
              Appointment Details
            </h3>

            <form
              onSubmit={handleSubmit}
              className="gap-6 grid grid-cols-1 md:grid-cols-2"
            >
              {/* Patient Name */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={appointment.patientName}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                  readOnly
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Gender
                </label>
                <select
                  name="gender"
                  value={appointment.gender}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Department
                </label>
                <select
                  name="department"
                  value={appointment.department}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={appointment.date}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Patient Email */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Patient Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={appointment.email}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                  readOnly
                />
              </div>

              {/* Doctor Name */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Doctor Name
                </label>
                <select
                  name="doctor"
                  value={appointment.doctor}
                  onChange={handleDoctorChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                  disabled={!appointment.department || fetchingDoctors}
                >
                  <option value="">Select Doctor</option>
                  {fetchingDoctors ? (
                    <option value="" disabled>
                      Loading doctors...
                    </option>
                  ) : (
                    doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={appointment.time}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                />
              </div>

              {/* Patient Phone Number */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Patient Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={appointment.phone}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                />
              </div>

              {/* Doctor Name Display (hidden but included in form data) */}
              <input
                type="hidden"
                name="doctorname"
                value={appointment.doctorname}
              />

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-700 hover:from-purple-700 hover:to-blue-600 shadow-md py-3 rounded-lg w-full font-semibold text-md text-white transition-all"
                  disabled={loading || fetchingDoctors}
                >
                  {loading ? "Processing..." : "Create Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;
