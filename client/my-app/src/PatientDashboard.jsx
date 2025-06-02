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
} from "react-icons/fa";
import bgImage from "./assets/b4.jpg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patientData, setPatientData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get read notifications from localStorage
  const getReadNotifications = () => {
    const readNotifications = localStorage.getItem('readNotifications');
    return readNotifications ? JSON.parse(readNotifications) : [];
  };

  // Save read notifications to localStorage
  const saveReadNotifications = (notificationIds) => {
    localStorage.setItem('readNotifications', JSON.stringify(notificationIds));
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

      const response = await axios.get(`http://localhost:5000/appointments?patient_email=${userEmail}`);
      console.log("Appointments response:", response.data);
      
      // Get the list of read notifications
      const readNotifications = getReadNotifications();
      console.log("Read notifications:", readNotifications);
      
      // Get current date for comparison
      const currentDate = new Date();
      
      // Filter appointments that have status changes and haven't been read
      const statusChanges = response.data
        .filter(appointment => {
          // Consider any non-pending status as a status change
          const isStatusChange = appointment.status !== "pending";
          const isUnread = !readNotifications.includes(appointment.id);
          
          // Check if the appointment is from today
          const appointmentDate = new Date(appointment.appointment_date);
          const isToday = appointmentDate.toDateString() === currentDate.toDateString();
          
          console.log("Checking appointment:", {
            id: appointment.id,
            status: appointment.status,
            isStatusChange,
            isUnread,
            isToday,
            doctor: appointment.doctorfullname,
            date: appointmentDate
          });
          
          return isStatusChange && isUnread;
        })
        // Sort by appointment date, most recent first
        .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
        // Take only the 5 most recent notifications
        .slice(0, 5);

      console.log("Filtered status changes:", statusChanges);

      if (statusChanges.length > 0) {
        setNotifications(statusChanges);
        // Show toast for new notifications
        statusChanges.forEach(change => {
          if (!readNotifications.includes(change.id)) {
            const statusMessage = 
              change.status === "accepted" ? "accepted your appointment" :
              change.status === "cancelled" ? "cancelled your appointment" :
              change.status === "completed" ? "marked your appointment as completed" :
              `updated your appointment status to ${change.status}`;

            toast.info(`Dr. ${change.doctorfullname} has ${statusMessage} for ${new Date(change.appointment_date).toLocaleDateString()}`);
          }
        });
      }
    } catch (error) {
      console.error("Error checking notifications:", error);
    }
  };

  // Function to mark notification as read
  const markAsRead = (notificationId) => {
    const readNotifications = getReadNotifications();
    const updatedReadNotifications = [...readNotifications, notificationId];
    saveReadNotifications(updatedReadNotifications);
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    setShowNotifications(notifications.length <= 1); // Close panel if no more notifications
  };

  // Function to mark all as read
  const markAllAsRead = () => {
    const notificationIds = notifications.map(notif => notif.id);
    const readNotifications = getReadNotifications();
    const updatedReadNotifications = [...readNotifications, ...notificationIds];
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
        const response = await axios.get(`http://localhost:5000/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.success) {
          const patientDetails = response.data.patient;
          setPatientData({
            full_name: patientDetails.full_name,
            email: patientDetails.email,
            phone: patientDetails.phone
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
      "readNotifications"
    ];
    
    itemsToClear.forEach(item => localStorage.removeItem(item));
    
    // Navigate to login page
    navigate("/patient-login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 h-screen">
      <ToastContainer />
      {/* Mobile Header - Right-aligned hamburger */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-between items-center bg-white shadow-md p-4">
        <div className="flex items-center">
          <FaUserCircle className="mr-3 text-blue-500 text-2xl" />
          <h1 className="font-bold text-blue-600 text-lg">{patientData.full_name}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notification Bell for Mobile */}
          <div className="relative">
            <button onClick={toggleNotifications} className="focus:outline-none">
              <FaBell 
                className={`text-xl ${notifications.length > 0 ? 'text-blue-600 animate-bounce' : 'text-gray-400'}`}
              />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="focus:outline-none text-gray-700"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar - Right Side */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        <div>
          <div className="flex items-center mt-12 md:mt-0 mb-6 p-4">
            <div className="flex items-center">
              <FaUserCircle className="mr-3 text-blue-500 text-4xl" />
              <div>
                <h1 className="font-bold text-blue-600 text-xl">
                  {patientData.full_name}
                </h1>
                <p className="text-gray-500 text-sm">Registered Patient</p>
              </div>
            </div>
          </div>
          <nav className="space-y-4 pt-12">
            <Link
              to="/Patient-Dashbord"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserCircle size={20} />
              <span className="font-semibold">Dashboard</span>
            </Link>
            <Link
              to="/BookAppointment"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarPlus size={20} />
              <span>Book Appointment</span>
            </Link>
            <Link
              to="/AppointmentHistory"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <FaHistory size={20} />
              <span>Appointment History</span>
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-500 hover:text-red-700"
        >
          <FaPowerOff size={20} />
          <span>Log out</span>
        </button>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden z-10 fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
              className="flex flex-col justify-center items-center bg-gradient-to-r from-green-300 to-green-500 shadow-md p-6 rounded-lg text-white hover:scale-105 transition transform w-full"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="relative flex items-center space-x-4">
                <FaHistory size={40} />
                <div className="relative">
                  <FaBell 
                    size={40} 
                    className={notifications.length > 0 ? 'animate-bounce' : ''} 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleNotifications();
                    }}
                  />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
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
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Recent Doctor's Responses</h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif, index) => (
                    <div 
                      key={index} 
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 relative"
                    >
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes size={14} />
                      </button>
                      <p className="font-medium text-gray-900">
                        Dr. {notif.doctorfullname}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: <span className={`font-medium ${
                          notif.status === "accepted" ? "text-green-600" :
                          notif.status === "cancelled" ? "text-red-600" :
                          notif.status === "completed" ? "text-blue-600" :
                          "text-yellow-600"
                        }`}>{notif.status.charAt(0).toUpperCase() + notif.status.slice(1)}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(notif.appointment_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Time: {notif.appointment_time}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.appointment_date).toLocaleString()}
                      </p>
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