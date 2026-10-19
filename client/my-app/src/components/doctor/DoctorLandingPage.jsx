import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImg from "/assets/doctorBg.png";
import AppointmentsContent from "./AppointmentsContent";
import PatientsContent from "./PatientsContent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBell,
  FaTimes,
  FaUserCircle,
  FaThLarge,
  FaCalendarCheck,
  FaUsers,
  FaUserMd,
  FaBars,
} from "react-icons/fa";
import DoctorProfile from "./DoctorProfile";

const DoctorLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isNotificationMinimized, setIsNotificationMinimized] = useState(false);
  const [doctorData, setDoctorData] = useState({
    doctorfullname: "",
    email: "",
    department: "",
    experiance: "",
    photo_url: "",
  });
  const [newAppointments, setNewAppointments] = useState([]);
  const [appointmentsForToday, setAppointmentsForToday] = useState([]);
  const [lastCheckedTime, setLastCheckedTime] = useState(new Date());
  const navigate = useNavigate();

  const getReadNotifications = () => {
    const read = localStorage.getItem("readNotifications");
    return read ? JSON.parse(read) : [];
  };

  const saveReadNotifications = (notificationIds) => {
    localStorage.setItem("readNotifications", JSON.stringify(notificationIds));
  };

  const verifyAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const doctorId = localStorage.getItem("doctorId");

      if (!token || !doctorId) {
        throw new Error("Not authenticated");
      }

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

  const checkNewAppointments = async () => {
    try {
      const doctorEmail = localStorage.getItem("doctorEmail");
      const doctorName = localStorage.getItem("doctorName");

      if (!doctorEmail && !doctorName) {
        return;
      }

      const response = await axios.get("http://localhost:5000/appointments");
      const readNotifications = getReadNotifications();

      const currentTime = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const allAppointmentsForDoctor = response.data.filter((appointment) => {
        const isForCurrentDoctor =
          appointment.doctorfullname === doctorName ||
          appointment.doctor_email === doctorEmail;
        return isForCurrentDoctor;
      });

      const newUnreadRequests = allAppointmentsForDoctor.filter(
        (appointment) => {
          const appointmentCreatedTime = new Date(
            appointment.createdAt || appointment.appointment_date
          );
          const isWithin24Hours =
            currentTime - appointmentCreatedTime <= 24 * 60 * 60 * 1000;
          const isUnread = !readNotifications.includes(appointment.id);

          return isWithin24Hours && isUnread;
        }
      );

      const unreadTodayAppointments = allAppointmentsForDoctor.filter(
        (appointment) => {
          const appointmentDate = new Date(appointment.appointment_date);
          appointmentDate.setHours(0, 0, 0, 0);

          const isToday = appointmentDate.getTime() === today.getTime();
          const isUnread = !readNotifications.includes(
            `today-${appointment.id}`
          );

          return isToday && isUnread;
        }
      );

      setNewAppointments(newUnreadRequests);
      setAppointmentsForToday(unreadTodayAppointments);

      newUnreadRequests.forEach((appointment) => {
        if (!readNotifications.includes(appointment.id)) {
          toast.info(
            `New appointment request from ${
              appointment.patient_name
            } for ${new Date(
              appointment.appointment_date
            ).toLocaleDateString()}`
          );
        }
      });
    } catch (error) {
      console.error("Error checking new appointments:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const markAsRead = (appointmentId, type) => {
    const readNotifications = getReadNotifications();
    let notificationIdToMark = appointmentId;
    if (type === "today") {
      notificationIdToMark = `today-${appointmentId}`;
    }
    const updatedReadNotifications = [
      ...readNotifications,
      notificationIdToMark,
    ];
    saveReadNotifications(updatedReadNotifications);

    if (type === "new") {
      setNewAppointments((prev) =>
        prev.filter((apt) => apt.id !== appointmentId)
      );
    } else if (type === "today") {
      setAppointmentsForToday((prev) =>
        prev.filter((apt) => apt.id !== appointmentId)
      );
    }

    if (
      newAppointments.length <= (type === "new" ? 1 : 0) &&
      appointmentsForToday.length <= (type === "today" ? 1 : 0)
    ) {
      setShowNotifications(false);
    }
  };

  const markAllAsRead = () => {
    const newAppointmentIds = newAppointments.map((apt) => apt.id);
    const todayAppointmentIds = appointmentsForToday.map(
      (apt) => `today-${apt.id}`
    );
    const readNotifications = getReadNotifications();
    const updatedReadNotifications = [
      ...readNotifications,
      ...newAppointmentIds,
      ...todayAppointmentIds,
    ];
    saveReadNotifications(updatedReadNotifications);
    setNewAppointments([]);
    setAppointmentsForToday([]);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    const authItems = [
      "token",
      "role",
      "doctorId",
      "doctorName",
      "doctorEmail",
      "department",
    ];
    authItems.forEach((item) => localStorage.removeItem(item));
    navigate("/");
  };

  useEffect(() => {
    const initializeDoctorDashboard = async () => {
      try {
        const isAuthenticated = await verifyAuth();
        if (!isAuthenticated) {
          return;
        }

        const token = localStorage.getItem("token");
        const doctorId = localStorage.getItem("doctorId");

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
            photo_url: doctorDetails.photo_url || "",
          });

          localStorage.setItem("doctorName", doctorDetails.doctorfullname);
          localStorage.setItem("doctorEmail", doctorDetails.email);
          localStorage.setItem("department", doctorDetails.department);

          await checkNewAppointments();
        } else {
          throw new Error(
            response.data.message || "Failed to fetch doctor details"
          );
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
    if (!showNotifications && appointmentsForToday.length > 0) {
      const readNotifications = getReadNotifications();
      const todayAppointmentIds = appointmentsForToday.map(
        (apt) => `today-${apt.id}`
      );
      const updatedReadNotifications = [
        ...readNotifications,
        ...todayAppointmentIds,
      ];
      saveReadNotifications(updatedReadNotifications);
      setAppointmentsForToday([]);
    }
    setShowNotifications(!showNotifications);
    setIsNotificationMinimized(false);
  };

  const toggleMinimizeNotifications = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsNotificationMinimized(!isNotificationMinimized);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderNavLinks = () => (
    <nav className="space-y-3 mt-8 text-gray-700">
      <a
        href="#"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
          activeContent === "dashboard" ? "bg-blue-100" : "hover:bg-blue-100"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleContentChange("dashboard");
        }}
      >
        <FaThLarge className="text-blue-500" size={18} />
        <span>Dashboard</span>
      </a>
      <a
        href="#"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
          activeContent === "appointments" ? "bg-blue-100" : "hover:bg-blue-100"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleContentChange("appointments");
        }}
      >
        <FaCalendarCheck className="text-blue-500" size={18} />
        <span>My Appointments</span>
      </a>
      <a
        href="#"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 ${
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
        <FaUsers className="text-blue-500" size={18} />
        <span>My Patients</span>
      </a>
      <a
        href="#"
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 ${
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
        <FaUserMd className="text-blue-500" size={18} />
        <span>My Profile</span>
      </a>
    </nav>
  );

  const renderContent = () => {
    switch (activeContent) {
      case "appointments":
        return <AppointmentsContent />;
      case "doctorProfile":
        return <DoctorProfile doctorData={doctorData} />;
      case "patients":
        return <PatientsContent />;
      case "dashboard":
      default:
        return (
          <>
            <div className="relative shadow-xl p-6 rounded-lg min-h-[200px] overflow-hidden">
              <div
                className="z-0 absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImg})` }}
              ></div>
              <div className="z-0 absolute inset-0 bg-gradient-to-r from-10% from-white via-30% via-white/70 to-90% to-transparent"></div>
              <div className="z-10 relative flex md:flex-row flex-col items-center">
                <div className="flex-1">
                  <h2 className="mb-2 font-semibold text-gray-800 text-xl md:text-2xl">
                    Welcome Dr. {doctorData.doctorfullname}!
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    {doctorData.email}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    {doctorData.department} Department • {doctorData.experiance}{" "}
                    Years Experience
                  </p>
                  <p className="mt-2 text-gray-500 text-sm md:text-base">
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

            {appointmentsForToday.length > 0 && (
              <div className="bg-blue-100 shadow-md mt-4 p-3 rounded-lg font-semibold text-blue-800 text-sm md:text-base text-center">
                You have {appointmentsForToday.length} today's appointments!
              </div>
            )}

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
                        newAppointments.length > 0 ||
                        appointmentsForToday.length > 0
                          ? "text-blue-600 animate-bounce"
                          : "text-gray-400"
                      }`}
                    />
                    {(newAppointments.length > 0 ||
                      appointmentsForToday.length > 0) && (
                      <span className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 border-2 border-white rounded-full w-6 h-6 text-white text-xs">
                        {newAppointments.length + appointmentsForToday.length}
                      </span>
                    )}
                  </button>
                </div>
                <p className="mt-2 font-bold text-blue-600 text-xl md:text-2xl">
                  {newAppointments.length + appointmentsForToday.length}
                </p>
                <p className="text-gray-500 text-xs md:text-sm">New Bookings</p>

                {showNotifications && newAppointments.length > 0 && (
                  <div className="top-full right-0 z-50 absolute bg-white shadow-xl mt-2 rounded-lg w-full sm:max-w-xs md:max-w-sm -translate-x-1/2 md:translate-x-0 transform">
                    <div className="flex justify-between items-center p-3 border-gray-200 border-b">
                      <h3 className="font-semibold text-gray-900">
                        New Appointments
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={markAllAsRead}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Mark all as read
                        </button>
                        <button
                          onClick={toggleMinimizeNotifications}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          {isNotificationMinimized ? "Expand" : "Minimize"}
                        </button>
                      </div>
                    </div>
                    <div
                      className={`overflow-y-auto ${
                        isNotificationMinimized ? "max-h-20" : "max-h-48"
                      }`}
                    >
                      {newAppointments.map((apt) => (
                        <div
                          key={`${apt.type}-${apt.id}`}
                          className="relative hover:bg-gray-50 p-3 border-gray-100 border-b"
                        >
                          <button
                            onClick={() => markAsRead(apt.id, apt.type)}
                            className="top-2 right-2 absolute text-gray-400 hover:text-gray-600"
                          >
                            <FaTimes size={14} />
                          </button>
                          <p className="font-medium text-gray-900">
                            {apt.patient_name}{" "}
                            {apt.type === "today"
                              ? "(Today's Appointment)"
                              : "(New Request)"}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Date:{" "}
                            {new Date(
                              apt.appointment_date
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Time: {apt.appointment_time}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Department: {apt.department}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Phone: {apt.patient_phone}
                          </p>
                          <p className="mt-1 text-gray-500 text-xs">
                            {new Date(
                              apt.createdAt || apt.appointment_date
                            ).toLocaleString()}
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
      <aside className="hidden top-0 left-0 z-20 fixed md:flex flex-col bg-white shadow-xl p-6 w-64 h-screen overflow-y-auto">
        <div className="text-center">
          {doctorData.photo_url ? (
            <img
              src={doctorData.photo_url}
              alt={`Dr. ${doctorData.doctorfullname}`}
              className="mx-auto border-2 border-blue-200 rounded-full w-20 h-20 object-cover"
            />
          ) : (
            <div className="flex justify-center items-center bg-gray-200 mx-auto rounded-full w-20 h-20">
              <FaUserCircle className="text-gray-400 text-4xl" />
            </div>
          )}
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

      {/* Mobile Header */}
      <header className="md:hidden top-0 z-30 sticky flex justify-between items-center bg-white shadow-md p-4">
        <div className="flex items-center">
          {doctorData.photo_url ? (
            <img
              src={doctorData.photo_url}
              alt={`Dr. ${doctorData.doctorfullname}`}
              className="mr-3 rounded-full w-10 h-10 object-cover"
            />
          ) : (
            <div className="flex justify-center items-center bg-gray-200 mr-3 rounded-full w-10 h-10">
              <FaUserCircle className="text-gray-400 text-xl" />
            </div>
          )}
          <h1 className="font-bold text-gray-800 text-xl">
            {activeContent.charAt(0).toUpperCase() + activeContent.slice(1)}
          </h1>
        </div>
        <button
          onClick={toggleMenu}
          className="focus:outline-none text-gray-700"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          onClick={toggleMenu}
        ></div>
        <div className="top-0 right-0 absolute bg-white shadow-lg w-4/5 h-full overflow-y-auto">
          <div className="flex flex-col p-4 h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 text-center">
                {doctorData.photo_url ? (
                  <img
                    src={doctorData.photo_url}
                    alt={`Dr. ${doctorData.doctorfullname}`}
                    className="mx-auto border-2 border-blue-200 rounded-full w-16 h-16 object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center bg-gray-200 mx-auto rounded-full w-16 h-16">
                    <FaUserCircle className="text-gray-400 text-3xl" />
                  </div>
                )}
                <h2 className="mt-2 font-semibold text-gray-700">
                  Dr. {doctorData.doctorfullname}
                </h2>
                <p className="text-gray-500 text-sm">{doctorData.email}</p>
              </div>
              <button
                onClick={toggleMenu}
                className="ml-4 focus:outline-none text-gray-700 hover:text-gray-900"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 shadow-md mb-6 py-3 rounded-lg w-full font-semibold text-white"
            >
              Log out
            </button>

            <nav className="flex-1 space-y-2">
              <a
                href="#"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-gray-700 ${
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
                <FaThLarge className="text-blue-500" size={18} />
                <span>Dashboard</span>
              </a>
              <a
                href="#"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 ${
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
                <FaCalendarCheck className="text-blue-500" size={18} />
                <span>My Appointments</span>
              </a>
              <a
                href="#"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 ${
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
                <FaUsers className="text-blue-500" size={18} />
                <span>My Patients</span>
              </a>
              <a
                href="#"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 ${
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
                <FaUserMd className="text-blue-500" size={18} />
                <span>My Profile</span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          isMenuOpen ? "z-20" : "z-10"
        } md:ml-64 min-h-screen`}
      >
        <div className="p-4 md:p-8">
          {activeContent === "dashboard" ? (
            <>
              <div className="top-0 z-20 sticky bg-gradient-to-br from-blue-50 to-gray-100 pb-4">
                <div className="flex md:flex-row flex-col justify-between items-start md:items-center space-y-3 md:space-y-0">
                  <h1 className="font-bold text-gray-800 text-2xl md:text-3xl">
                    Dashboard
                  </h1>
                  <div className="bg-white shadow-md px-4 md:px-6 py-2 md:py-3 rounded-lg w-full md:w-auto">
                    {appointmentsForToday.length > 0 && (
                      <p className="mb-1 font-semibold text-blue-600 text-sm md:text-base">
                        You have {appointmentsForToday.length} today's
                        appointments!
                      </p>
                    )}
                    <span className="text-gray-500 text-xs md:text-sm">
                      Today's Date
                    </span>
                    <p className="font-semibold text-gray-700 text-md md:text-lg">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">{renderContent()}</div>
            </>
          ) : (
            <div className="relative">
              <div className="top-0 z-20 sticky bg-gradient-to-br from-blue-50 to-gray-100 pb-4">
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
