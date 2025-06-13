import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarPlus,
  FaHistory,
  FaUserCircle,
  FaPowerOff,
  FaBars,
  FaTimes,
  FaBell,
  FaThLarge,
  FaCalendarCheck,
  FaUsers,
} from "react-icons/fa";
import bgImage from "/assets/b4.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientSidebar from "./PatientSidebar";

const PatientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patientData, setPatientData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isNotificationMinimized, setIsNotificationMinimized] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get read notifications from localStorage
  const getReadNotifications = () => {
    const readNotifications = localStorage.getItem("readNotifications");
    return readNotifications ? JSON.parse(readNotifications) : [];
  };

  // Save read notifications to localStorage
  const saveReadNotifications = (notificationIds) => {
    localStorage.setItem("readNotifications", JSON.stringify(notificationIds));
  };

  // Function to check for new appointment status changes
  const checkNewNotifications = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail") || patientData.email;
      console.log("Checking notifications for email:", userEmail);

      if (!userEmail) {
        console.log("No user email found");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/appointments?patient_email=${userEmail}`
      );
      console.log("Appointments response:", response.data);

      // Get the list of read notifications
      const readNotifications = getReadNotifications();
      console.log("Read notifications:", readNotifications);

      // Get current date for comparison
      const currentDate = new Date();

      // Filter appointments that have status changes and haven't been read
      const statusChanges = response.data
        .filter((appointment) => {
          // Consider any non-pending status as a status change
          const isStatusChange = appointment.status !== "pending";
          const notificationKey = `${appointment.id}-${appointment.status}`;
          const isUnread = !readNotifications.includes(notificationKey);

          // Check if the appointment is from today
          const appointmentDate = new Date(appointment.appointment_date);
          const isToday =
            appointmentDate.toDateString() === currentDate.toDateString();

          console.log("Checking appointment:", {
            id: appointment.id,
            status: appointment.status,
            updatedAt: appointment.updatedAt,
            notificationKey: notificationKey,
            isStatusChange,
            isUnread,
            isToday,
            doctor: appointment.doctorfullname,
            date: appointmentDate,
          });

          return isStatusChange && isUnread;
        })
        // Sort by appointment date, most recent first
        .sort(
          (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
        )
        // Take only the 5 most recent notifications
        .slice(0, 5);

      console.log("Filtered status changes (after filter/sort/slice):", statusChanges);

      if (statusChanges.length > 0) {
        setNotifications(statusChanges);
        // Show toast for new notifications
        statusChanges.forEach((change) => {
          const notificationKey = `${change.id}-${change.status}`;
          const alreadyRead = readNotifications.includes(notificationKey);
          console.log("Attempting to display toast for:", {
            id: change.id,
            status: change.status,
            notificationKey: notificationKey,
            alreadyRead: alreadyRead,
          });

          if (!alreadyRead) {
            const statusMessage =
              change.status === "accepted"
                ? "accepted your appointment"
                : change.status === "cancelled"
                ? "cancelled your appointment"
                : change.status === "completed"
                ? "marked your appointment as completed"
                : `updated your appointment status to ${change.status}`;

            toast.info(
              `Dr. ${change.doctorfullname} has ${statusMessage} for ${new Date(
                change.appointment_date
              ).toLocaleDateString()}`
            );
          }
        });
      }
    } catch (error) {
      console.error("Error checking notifications:", error);
    }
  };

  // Function to mark notification as read
  const markAsRead = (notificationId, status) => {
    const readNotifications = getReadNotifications();
    const notificationKey = `${notificationId}-${status}`;
    const updatedReadNotifications = [...readNotifications, notificationKey];
    saveReadNotifications(updatedReadNotifications);
    setNotifications((prev) =>
      prev.filter((notif) => `${notif.id}-${notif.status}` !== notificationKey)
    );
    setShowNotifications(notifications.length <= 1); // Close panel if no more notifications
  };

  // Function to mark all as read
  const markAllAsRead = () => {
    const notificationKeys = notifications.map((notif) => `${notif.id}-${notif.status}`);
    const readNotifications = getReadNotifications();
    const updatedReadNotifications = [...readNotifications, ...notificationKeys];
    saveReadNotifications(updatedReadNotifications);
    setNotifications([]);
    setShowNotifications(false);
  };

  // Toggle notifications panel
  const toggleNotifications = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const patientId = localStorage.getItem("patientId");

    // Only redirect to login if both token and patientId are missing
    if (!token || !patientId) {
      navigate("/patient-login");
      return;
    }

    // Fetch patient details
    const fetchPatientDetails = async () => {
      try {
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

          // Store email in localStorage for notifications
          localStorage.setItem("userEmail", patientDetails.email);
        } else {
          // Don't throw error for non-success response
          console.warn("Non-success response:", response.data.message);
          toast.error("Unable to fetch your details. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        // Only logout for actual authentication errors
        if (error.response?.status === 401) {
          handleLogout();
        } else {
          // For other errors, just show a toast but keep the user logged in
          toast.error("Unable to fetch your details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Initialize dashboard with proper error handling
    const initializeDashboard = async () => {
      try {
        await fetchPatientDetails();
        await checkNewNotifications();
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        // Only logout for authentication errors
        if (error.response?.status === 401) {
          handleLogout();
        }
        setLoading(false);
      }
    };

    initializeDashboard();

    // Set up polling for notifications
    const pollInterval = setInterval(checkNewNotifications, 30000);
    return () => clearInterval(pollInterval);
  }, []); // Remove navigate from dependencies

  const handleLogout = () => {
    // Clear all patient-related data from localStorage
    const itemsToClear = [
      "token",
      "role",
      "patientId",
      "userEmail",
      "readNotifications",
    ];

    itemsToClear.forEach((item) => localStorage.removeItem(item));

    // Navigate to login page
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-gray-100 h-screen">
      <ToastContainer />
      
      {/* Use the shared PatientSidebar component */}
      <PatientSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        patientData={patientData}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:mr-0 p-6">
        {/* Welcome Message with Background Image */}
        <div
          className="relative flex flex-col justify-center shadow-md p-6 rounded-lg w-full h-48 md:h-60 text-white"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="font-bold text-blue-500 text-2xl">
            Welcome, {patientData.full_name}
          </h2>
          <p className="mt-2 text-blue-500 text-sm">
            The hospital management systems provide real-time updates on patient
            vitals, treatment progress, and appointment schedules, enabling
            healthcare providers to deliver efficient, well-coordinated, and
            personalized care.
          </p>
        </div>

        {/* Appointment Cards */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mt-6">
          <Link
            to="/BookAppointment"
            className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-300 to-blue-500 shadow-md p-6 rounded-lg text-white hover:scale-105 transition transform"
            onClick={() => setSidebarOpen(false)}
          >
            <FaCalendarPlus size={40} />
            <h3 className="mt-2 font-semibold text-lg">Book My Appointment</h3>
            <p className="text-sm">Book Appointment</p>
          </Link>

          <div className="relative">
            <Link
              to="/AppointmentHistory"
              className="flex flex-col justify-center items-center bg-gradient-to-r from-green-300 to-green-500 shadow-md p-6 rounded-lg w-full text-white hover:scale-105 transition transform"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="relative flex items-center space-x-4">
                <FaHistory size={40} />
                <div className="relative">
                  <FaBell
                    size={40}
                    className={notifications.length > 0 ? "animate-bounce" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleNotifications();
                    }}
                  />
                  {notifications.length > 0 && (
                    <span className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 border-2 border-white rounded-full w-6 h-6 text-white text-xs">
                      {notifications.length}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="mt-2 font-semibold text-lg">
                My Appointment History
              </h3>
              <p className="text-sm">View Status & Updates</p>
            </Link>

            {/* Notifications Panel */}
            {showNotifications && notifications.length > 0 && (
              <div className="top-full right-0 z-50 absolute bg-white shadow-xl mt-2 rounded-lg w-full sm:max-w-xs md:max-w-sm transform -translate-x-1/2 md:translate-x-0">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-gray-200 border-b">
                  <h3 className="font-semibold text-gray-900">
                    Doctor's Responses ({notifications.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Mark all as read
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMinimizeNotifications();
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      {isNotificationMinimized ? 'Expand' : 'Minimize'}
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className={`overflow-y-auto ${isNotificationMinimized ? 'max-h-20' : 'max-h-48'}`}>
                  {notifications.map((notif) => (
                    <div
                      key={`${notif.id}-${notif.status}`}
                      className="relative hover:bg-gray-50 p-3 border-gray-100 border-b"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id, notif.status);
                        }}
                        className="top-2 right-2 absolute text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes size={14} />
                      </button>
                      <div className="pr-6">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-gray-900">
                            Dr. {notif.doctorfullname}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              notif.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : notif.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : notif.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {notif.status.charAt(0).toUpperCase() + notif.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Date: {new Date(notif.appointment_date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Time: {notif.appointment_time}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Department: {notif.department}
                        </p>
                        <p className="mt-1 text-gray-500 text-xs">
                          Updated: {new Date(notif.updatedAt || notif.appointment_date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
