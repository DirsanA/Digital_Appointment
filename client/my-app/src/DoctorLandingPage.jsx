import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImg from "/assets/doctorBg.png";
import AppointmentsContent from "./AppointmentsContent";
import PatientsContent from "./PatientsContent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBell, FaTimes } from "react-icons/fa";
import DoctorProfile from "./DoctorProfile";

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

  // Function to verify token and doctor authentication
  const verifyAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const doctorId = localStorage.getItem("doctorId");

      if (!token || !doctorId) {
        throw new Error("Not authenticated");
      }

      // Verify token with backend
      const response = await axios.get(
        `http://localhost:5000/admin/doctors/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error("Invalid authentication");
      }

      return true;
    } catch (error) {
      console.error("Auth error:", error);
      handleLogout();
      return false;
    }
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

      // Filter appointments for the current doctor that are newly created
      const currentTime = new Date();
      const recentAppointments = response.data.filter((appointment) => {
        const isForCurrentDoctor =
          appointment.doctorfullname === doctorName ||
          appointment.doctor_email === doctorEmail;
        const appointmentCreatedTime = new Date(
          appointment.createdAt || appointment.appointment_date
        );
        const isWithin24Hours =
          currentTime - appointmentCreatedTime <= 24 * 60 * 60 * 1000;
        const isUnread = !readAppointments.includes(appointment.id);
        
        return isForCurrentDoctor && isWithin24Hours && isUnread;
      });

      if (recentAppointments.length > 0) {
        setNewAppointments(recentAppointments);
        // Show toast for new appointments
        recentAppointments.forEach(appointment => {
          if (!readAppointments.includes(appointment.id)) {
            toast.info(`New appointment request from ${appointment.patient_name} for ${new Date(appointment.appointment_date).toLocaleDateString()}`);
          }
        });
      }
    } catch (error) {
      console.error("Error checking new appointments:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Function to mark appointment as read
  const markAsRead = (appointmentId) => {
    // Get current read appointments
    const readAppointments = getReadAppointments();

    // Add new appointment ID to read list
    const updatedReadAppointments = [...readAppointments, appointmentId];

    // Save to localStorage
    saveReadAppointments(updatedReadAppointments);

    // Update state to remove the appointment from view
    setNewAppointments((prev) =>
      prev.filter((apt) => apt.id !== appointmentId)
    );

    // Close panel if no more notifications
    if (newAppointments.length <= 1) {
      setShowNotifications(false);
    }
  };

  // Function to mark all as read
  const markAllAsRead = () => {
    // Get IDs of all current notifications
    const appointmentIds = newAppointments.map((apt) => apt.id);

    // Get current read appointments
    const readAppointments = getReadAppointments();

    // Add all new appointment IDs to read list
    const updatedReadAppointments = [...readAppointments, ...appointmentIds];

    // Save to localStorage
    saveReadAppointments(updatedReadAppointments);

    // Clear notifications
    setNewAppointments([]);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    const authItems = ["token", "role", "doctorId", "doctorName", "doctorEmail", "department"];
    authItems.forEach(item => localStorage.removeItem(item));
    navigate("/login");
  };

  useEffect(() => {
    const initializeDoctorDashboard = async () => {
      try {
        // First verify authentication
        const isAuthenticated = await verifyAuth();
        if (!isAuthenticated) {
          return;
        }

        const token = localStorage.getItem("token");
        const doctorId = localStorage.getItem("doctorId");

        // Fetch doctor details
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

          // Store minimal data for API calls
          localStorage.setItem("doctorName", doctorDetails.doctorfullname);
          localStorage.setItem("doctorEmail", doctorDetails.email);
          localStorage.setItem("department", doctorDetails.department);

          // Check for new appointments
          await checkNewAppointments();
        } else {
          throw new Error(response.data.message || "Failed to fetch doctor details");
        }
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Session expired. Please login again.");
          handleLogout();
        } else {
          toast.error("Error loading data. Please try again.");
        }
      }
    };

    initializeDoctorDashboard();

    // Set up polling for new appointments
    const pollInterval = setInterval(checkNewAppointments, 30000);
    return () => clearInterval(pollInterval);
  }, [navigate]);

  const handleContentChange = (newContent) => {
    setActiveContent(newContent);
  };

  const toggleNotifications = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowNotifications(!showNotifications);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Modified navigation links to use handleContentChange
  const renderNavLinks = () => (
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
          handleContentChange("dashboard");
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
          handleContentChange("appointments");
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
          handleContentChange("patients");
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
          handleContentChange("doctorProfile");
          toggleMenu();
        }}
      >
        My Profile
      </a>
    </nav>
  );

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
            {/* Welcome Card with Background Image */}
            <div className="relative shadow-xl p-6 rounded-lg min-h-[200px] overflow-hidden">
              <div
                className="z-0 absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImg})` }}
              ></div>
              <div className="z-0 absolute inset-0 bg-gradient-to-r from-10% from-white via-30% via-white/70 to-90% to-transparent"></div>
              <div className="z-10 relative flex md:flex-row flex-col items-center">
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800 text-xl md:text-2xl mb-2">
                    Welcome Dr. {doctorData.doctorfullname}!
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    {doctorData.email}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    {doctorData.department} Department • {doctorData.experiance}{" "}
                    Years Experience
                  </p>
                  <p className="text-gray-500 text-sm md:text-base mt-2">
                    Today's Date: {new Date().toLocaleDateString()}
                  </p>
                  <div className="flex space-x-3 mt-4">
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
              <div className="relative bg-white shadow-md p-4 md:p-6 rounded-lg text-center">
                <div className="flex justify-center items-center">
                  <button
                    onClick={toggleNotifications}
                    className="inline-flex relative justify-center items-center"
                  >
                    <FaBell
                      className={`text-2xl md:text-3xl ${
                        newAppointments.length > 0
                          ? "text-blue-600 animate-bounce"
                          : "text-gray-400"
                      }`}
                    />
                    {newAppointments.length > 0 && (
                      <span className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 border-2 border-white rounded-full w-6 h-6 text-white text-xs">
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
                  <>
                    {/* Overlay to prevent background scroll */}
                    <div 
                      className="fixed inset-0 bg-transparent z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                      {/* Fixed Header */}
                      <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          New Appointments
                        </h3>
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Mark all as read
                        </button>
                      </div>

                      {/* Scrollable Cards Section - Height set for 2 cards */}
                      <div className="overflow-y-auto" style={{ height: '160px' }}>
                        {newAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-2 border-b border-gray-100 hover:bg-gray-50 relative"
                            style={{ height: '80px' }}
                          >
                            <button
                              onClick={() => markAsRead(apt.id)}
                              className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-1"
                            >
                              <FaTimes size={12} />
                            </button>
                            <div className="pr-6">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                                  {apt.patient_name}
                                </p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                  New
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-x-2 text-xs text-gray-600 mt-1">
                                <span className="truncate">Date: {new Date(apt.appointment_date).toLocaleDateString()}</span>
                                <span className="truncate">Time: {apt.appointment_time}</span>
                                <span className="truncate">Dept: {apt.department}</span>
                                <span className="truncate">Ph: {apt.patient_phone}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Fixed Footer */}
                      <div className="p-1.5 border-t border-gray-200">
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="w-full text-center text-xs text-gray-600 hover:text-gray-800 py-1 hover:bg-gray-50 rounded"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="relative flex md:flex-row flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <ToastContainer />
      {/* Desktop Sidebar - Made fixed */}
      <aside className="hidden z-20 md:flex flex-col fixed left-0 top-0 bg-white shadow-xl p-6 w-64 h-screen overflow-y-auto">
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
        {renderNavLinks()}
      </aside>

      {/* Mobile Header - Made sticky */}
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

      {/* Mobile Menu - Overlay */}
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

      {/* Main Content - Adjusted margin for fixed sidebar */}
      <main className={`flex-1 ${isMenuOpen ? "z-20" : "z-10"} md:ml-64 min-h-screen`}>
        <div className="p-4 md:p-8">
          {activeContent === "dashboard" ? (
            <>
              {/* Dashboard Header - Made sticky */}
              <div className="sticky top-0 z-20 bg-gradient-to-br from-blue-50 to-gray-100 pb-4">
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
              </div>

              {/* Rest of dashboard content */}
              <div className="mt-6">
                {renderContent()}
              </div>
            </>
          ) : (
            // Render other content components with sticky headers
            <div className="relative">
              {/* Sticky header for AppointmentsContent and PatientsContent */}
              <div className="sticky top-0 z-20 bg-gradient-to-br from-blue-50 to-gray-100 pb-4">
                {renderContent()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorLandingPage;
