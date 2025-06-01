import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImg from "/assets/doctorBg.png";
import AppointmentsContent from "./AppointmentsContent";
import PatientsContent from "./PatientsContent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBell, FaTimes } from 'react-icons/fa';

const DoctorLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [doctorData, setDoctorData] = useState({
    doctorfullname: "",
    email: "",
    department: "",
    experiance: "",
  });
  const [newAppointments, setNewAppointments] = useState([]);
  const [lastCheckedTime, setLastCheckedTime] = useState(new Date());
  const navigate = useNavigate();

  // Get read appointments from localStorage
  const getReadAppointments = () => {
    const readAppointments = localStorage.getItem('readAppointments');
    return readAppointments ? JSON.parse(readAppointments) : [];
  };

  // Save read appointments to localStorage
  const saveReadAppointments = (appointmentIds) => {
    localStorage.setItem('readAppointments', JSON.stringify(appointmentIds));
  };

  // Function to check for new appointments
  const checkNewAppointments = async () => {
    try {
      const doctorEmail = localStorage.getItem("doctorEmail");
      const doctorName = localStorage.getItem("doctorName");
      
      if (!doctorEmail && !doctorName) {
        return;
      }

      const response = await axios.get("http://localhost:5000/appointments");
      
      // Get the list of read appointments
      const readAppointments = getReadAppointments();
      
      // Filter appointments for the current doctor that are newly created (within last 24 hours)
      // and haven't been marked as read
      const currentTime = new Date();
      const recentAppointments = response.data.filter(appointment => {
        const isForCurrentDoctor = appointment.doctorfullname === doctorName || 
                                 appointment.doctor_email === doctorEmail;
        const appointmentCreatedTime = new Date(appointment.createdAt || appointment.appointment_date);
        const isWithin24Hours = (currentTime - appointmentCreatedTime) <= 24 * 60 * 60 * 1000;
        const isUnread = !readAppointments.includes(appointment.id);
        return isForCurrentDoctor && isWithin24Hours && isUnread;
      });

      // If there are new appointments, update state
      if (recentAppointments.length > 0) {
        setNewAppointments(recentAppointments);
      }
    } catch (error) {
      console.error("Error checking new appointments:", error);
    }
  };

  // Check for new appointments when component mounts
  useEffect(() => {
    checkNewAppointments();
  }, []);

  // Function to mark appointment as read
  const markAsRead = (appointmentId) => {
    // Get current read appointments
    const readAppointments = getReadAppointments();
    
    // Add new appointment ID to read list
    const updatedReadAppointments = [...readAppointments, appointmentId];
    
    // Save to localStorage
    saveReadAppointments(updatedReadAppointments);
    
    // Update state to remove the appointment from view
    setNewAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  };

  // Function to mark all as read
  const markAllAsRead = () => {
    // Get IDs of all current notifications
    const appointmentIds = newAppointments.map(apt => apt.id);
    
    // Get current read appointments
    const readAppointments = getReadAppointments();
    
    // Add all new appointment IDs to read list
    const updatedReadAppointments = [...readAppointments, ...appointmentIds];
    
    // Save to localStorage
    saveReadAppointments(updatedReadAppointments);
    
    // Clear current notifications
    setNewAppointments([]);
    setShowNotifications(false);
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Poll for new appointments every 30 seconds
  useEffect(() => {
    const pollInterval = setInterval(checkNewAppointments, 30000);
    return () => clearInterval(pollInterval);
  }, [lastCheckedTime]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch doctor details
    const fetchDoctorDetails = async () => {
      try {
        const doctorId = localStorage.getItem("doctorId");
        if (!doctorId) {
          throw new Error("Doctor ID not found");
        }

        const response = await axios.get(
          `http://localhost:5000/admin/doctors/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const doctorDetails = response.data.doctor;
          setDoctorData({
            doctorfullname: doctorDetails.doctorfullname,
            email: doctorDetails.email,
            department: doctorDetails.department,
            experiance: doctorDetails.experiance,
          });

          // Store doctor's name and email in localStorage
          localStorage.setItem("doctorName", doctorDetails.doctorfullname);
          localStorage.setItem("doctorEmail", doctorDetails.email);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch doctor details"
          );
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("doctorId");
          localStorage.removeItem("doctorName");
          localStorage.removeItem("doctorEmail");
          navigate("/login");
        }
      }
    };

    fetchDoctorDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("doctorName");
    localStorage.removeItem("doctorEmail");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderContent = () => {
    switch (activeContent) {
      case "appointments":
        return <AppointmentsContent />;
      case "doctorProfile":
        return <DoctorProfile />;
      case "patients":
        return <PatientsContent />;
      case "dashboard":
      default:
        return (
          <>
            <div className="flex md:flex-row flex-col justify-between items-start md:items-center space-y-3 md:space-y-0">
              <h1 className="font-bold text-gray-800 text-2xl md:text-3xl">
                Dashboard
              </h1>
              <div className="bg-white shadow-md px-4 md:px-6 py-2 md:py-3 rounded-lg w-full md:w-auto">
                <span className="text-gray-500 text-xs md:text-sm">
                  Today's Date
                </span>
                <p className="font-semibold text-gray-700 text-md md:text-lg">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Welcome Card with Background Image */}
            <div className="relative shadow-xl mt-6 p-6 rounded-lg min-h-[200px] overflow-hidden">
              <div
                className="z-0 absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImg})` }}
              ></div>
              <div className="z-0 absolute inset-0 bg-gradient-to-r from-10% from-white via-30% via-white/70 to-90% to-transparent"></div>
              <div className="z-10 relative flex md:flex-row flex-col items-center">
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800 text-xl md:text-2xl">
                    Welcome Dr. {doctorData.doctorfullname}!
                  </h2>
                  <p className="mt-2 text-gray-600 text-sm md:text-base">
                    {doctorData.email}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    {doctorData.department} Department • {doctorData.experiance}{" "}
                    Years Experience
                  </p>
                  <div className="flex space-x-3 mt-3 md:mt-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 shadow-md px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-white text-sm md:text-base"
                      onClick={() => setActiveContent("appointments")}
                    >
                      View Appointments
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 shadow-md px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-white text-sm md:text-base"
                      onClick={() => setActiveContent("patients")}
                    >
                      View Patients
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Cards */}
            <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-3 mt-6 md:mt-8">
              <div className="bg-white shadow-md p-4 md:p-6 rounded-lg text-center">
                <p className="font-bold text-blue-600 text-2xl md:text-3xl">
                  1
                </p>
                <p className="text-gray-500 text-xs md:text-sm">All Doctors</p>
              </div>
              <div className="bg-white shadow-md p-4 md:p-6 rounded-lg text-center">
                <p className="font-bold text-blue-600 text-2xl md:text-3xl">
                  2
                </p>
                <p className="text-gray-500 text-xs md:text-sm">All Patients</p>
              </div>
              <div className="bg-white shadow-md p-4 md:p-6 rounded-lg text-center relative">
                <div className="flex items-center justify-center">
                  <button 
                    onClick={toggleNotifications}
                    className="relative inline-flex items-center justify-center"
                  >
                    <FaBell 
                      className={`text-2xl md:text-3xl ${newAppointments.length > 0 ? 'text-blue-600 animate-bounce' : 'text-gray-400'}`}
                    />
                    {newAppointments.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        {newAppointments.length}
                      </span>
                    )}
                  </button>
                </div>
                <p className="mt-2 font-bold text-blue-600 text-xl md:text-2xl">
                  {newAppointments.length}
                </p>
                <p className="text-gray-500 text-xs md:text-sm">New Bookings</p>

                {/* Notifications Panel */}
                {showNotifications && newAppointments.length > 0 && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">New Appointments</h3>
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {newAppointments.map((apt, index) => (
                        <div 
                          key={index} 
                          className="p-3 border-b border-gray-100 hover:bg-gray-50 relative"
                        >
                          <button
                            onClick={() => markAsRead(apt.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                          >
                            <FaTimes size={14} />
                          </button>
                          <p className="font-medium text-gray-900">{apt.patient_name}</p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(apt.appointment_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Time: {apt.appointment_time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Department: {apt.department}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="relative flex md:flex-row flex-col bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <ToastContainer />
      {/* Desktop Sidebar */}
      <aside className="hidden z-10 md:flex flex-col bg-white shadow-xl p-6 w-64 min-h-screen">
        <div className="text-center">
          <div className="bg-gray-300 mx-auto rounded-full w-20 h-20"></div>
          <h2 className="mt-2 font-semibold text-gray-700 text-lg">
            Dr. {doctorData.doctorfullname}
          </h2>
          <p className="text-gray-500 text-sm">{doctorData.email}</p>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 shadow-md mt-6 py-3 rounded-lg w-full font-semibold text-white text-base"
        >
          Log out
        </button>
        <nav className="space-y-3 mt-8 text-gray-700">
          <a
            href="#"
            className={`block px-4 py-3 rounded-lg font-medium ${
              activeContent === "dashboard"
                ? "bg-blue-100"
                : "hover:bg-blue-100"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveContent("dashboard");
            }}
          >
            Dashboard
          </a>
          <a
            href="#"
            className={`block px-4 py-3 rounded-lg ${
              activeContent === "appointments"
                ? "bg-blue-100"
                : "hover:bg-blue-100"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveContent("appointments");
            }}
          >
            My Appointments
          </a>

          <a
            href="#"
            className={`block px-4 py-3 rounded-lg text-gray-700 ${
              activeContent === "patients"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveContent("patients");
              toggleMenu();
            }}
          >
            My Patients
          </a>

          <a
            href="#"
            className={`block px-4 py-3 rounded-lg text-gray-700 ${
              activeContent === "doctorProfile"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveContent("doctorProfile");
              toggleMenu();
            }}
          >
            My Profile
          </a>
        </nav>
      </aside>

      {/* Mobile Header with toggle button on the right */}
      <header className="md:hidden top-0 z-30 sticky flex justify-between items-center bg-white shadow-md p-4">
        <h1 className="font-bold text-gray-800 text-xl">
          {activeContent.charAt(0).toUpperCase() + activeContent.slice(1)}
        </h1>
        <button
          onClick={toggleMenu}
          className="focus:outline-none text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Mobile Menu - Fixed visibility and hover states */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={toggleMenu}
        ></div>
        <div className="top-0 right-0 absolute bg-white shadow-lg w-4/5 h-full overflow-y-auto">
          <div className="flex flex-col p-4 h-full">
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 text-center">
                <div className="bg-gray-300 mx-auto rounded-full w-16 h-16"></div>
                <h2 className="mt-2 font-semibold text-gray-700">
                  Dr. {doctorData.doctorfullname}
                </h2>
                <p className="text-gray-500 text-sm">{doctorData.email}</p>
              </div>
              <button
                onClick={toggleMenu}
                className="ml-4 focus:outline-none text-gray-700 hover:text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 shadow-md mb-6 py-3 rounded-lg w-full font-semibold text-white"
            >
              Log out
            </button>

            {/* Navigation Links - Fixed visibility */}
            <nav className="flex-1 space-y-2">
              <a
                href="#"
                className={`block px-4 py-3 rounded-lg font-medium text-gray-700 ${
                  activeContent === "dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveContent("dashboard");
                  toggleMenu();
                }}
              >
                Dashboard
              </a>
              <a
                href="#"
                className={`block px-4 py-3 rounded-lg text-gray-700 ${
                  activeContent === "appointments"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveContent("appointments");
                  toggleMenu();
                }}
              >
                My Appointments
              </a>
              <a
                href="#"
                className={`block px-4 py-3 rounded-lg text-gray-700 ${
                  activeContent === "patients"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveContent("patients");
                  toggleMenu();
                }}
              >
                My Patients
              </a>
              <a
                href="#"
                className={`block px-4 py-3 rounded-lg text-gray-700 ${
                  activeContent === "doctorProfile"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveContent("doctorProfile");
                }}
              >
                My Profile
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-8 ${isMenuOpen ? "z-20" : "z-10"}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default DoctorLandingPage;
