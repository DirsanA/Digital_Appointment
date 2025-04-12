import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaCalendarPlus, 
  FaHistory, 
  FaUserCircle, 
  FaPowerOff, 
  FaBars, 
  FaTimes
} from "react-icons/fa";
import bgImage from "./assets/b4.jpg";

const AppointmentHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedAppointment, setEditedAppointment] = useState({});
  const [dateError, setDateError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Abenezer",
      department: "Cardiology",
      date: "2025-04-05",
      email: "abenezer@example.com",
      doctor: "Dr. Desu",
      time: "10:00",
      phone: "090742",
      status: "Approved"
    },
    {
      id: 2,
      patientName: "Abenezer",
      department: "Neurology",
      date: "2025-04-10",
      email: "abenezer@example.com",
      doctor: "Dr. Elias",
      time: "14:30",
      phone: "090742",
      status: "Pending"
    },
    {
      id: 3,
      patientName: "Abenezer",
      department: "Pediatrics",
      date: "2025-04-15",
      email: "abenezer@example.com",
      doctor: "Dr. Haileeysus",
      time: "09:00",
      phone: "090742",
      status: "Declined"
    }
  ]);

  const patientName = "Abenezer";
  const departments = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics"];
  const doctors = ["Dr. Desu", "Dr. Elias", "Dr. Haileeysus"];

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleCancelAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancle this appointment?")) {
      setAppointments(appointments.map(appt => 
        appt.id === id ? { ...appt, status: "Canclled" } : appt
      ));
    }
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments(appointments.filter(appt => appt.id !== id));
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingId(appointment.id);
    setEditedAppointment({ ...appointment });
    setDateError("");
    setDropdownOpen(null);
  };

  const validateDate = (date) => {
    const today = new Date(getTodayDate());
    const selectedDate = new Date(date);
    return selectedDate >= today;
  };

  const handleUpdateAppointment = () => {
    if (!validateDate(editedAppointment.date)) {
      setDateError("Please select a future date");
      return;
    }
    
    setAppointments(appointments.map(appt => 
      appt.id === editingId ? editedAppointment : appt
    ));
    setEditingId(null);
    setDateError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDateError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedAppointment({
      ...editedAppointment,
      [name]: value
    });

    if (name === "date") {
      if (!validateDate(value)) {
        setDateError("Please select a future date");
      } else {
        setDateError("");
      }
    }
  };

  const formatDateForDisplay = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeForDisplay = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10 flex justify-between items-center">
        <div className="flex items-center">
          <FaUserCircle className="text-blue-500 text-2xl mr-3" />
          <h1 className="text-lg font-bold text-blue-600">{patientName}</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 md:w-1/4`}>
        <div className="overflow-y-auto">
          <div className="flex items-center mb-6 p-4 md:mt-0 mt-12">
            <div className="flex items-center">
              <FaUserCircle className="text-blue-500 text-4xl mr-3" />
              <div>
                <h1 className="text-xl font-bold text-blue-600">{patientName}</h1>
                <p className="text-sm text-gray-500">Registered Patient</p>
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
              className="flex items-center space-x-2 text-blue-500 font-bold"
              onClick={() => setSidebarOpen(false)}
            >
              <FaHistory size={20} />
              <span>Appointment History</span>
            </Link>
          </nav>
        </div>
        <Link 
          to="/logout" 
          className="flex items-center space-x-2 text-red-500 hover:text-red-700"
          onClick={() => setSidebarOpen(false)}
        >
          <FaPowerOff size={20} />
          <span>Log out</span>
        </Link>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div
            className="relative p-6 rounded-lg shadow-md text-white w-full h-48 flex flex-col justify-center mb-8"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="text-2xl font-bold text-blue-500">Welcome {patientName}</h2>
            <p className="mt-2 text-blue-500">
              Manage your medical appointments, you can update, delete and 
              cancel your appointments.
            </p>
          </div>

          {/* Appointment History Table */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaHistory className="mr-2 text-blue-600" />
              Your Appointments
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <th className="p-3 text-left rounded-l-lg">Patient</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Doctor</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr 
                      key={appointment.id} 
                      className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-3 text-gray-700">{appointment.patientName}</td>
                      
                      {/* Department */}
                      <td className="p-3 text-gray-700">
                        {editingId === appointment.id ? (
                          <select
                            name="department"
                            value={editedAppointment.department}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded"
                          >
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        ) : (
                          appointment.department
                        )}
                      </td>
                      
                      {/* Doctor */}
                      <td className="p-3 text-gray-700">
                        {editingId === appointment.id ? (
                          <select
                            name="doctor"
                            value={editedAppointment.doctor}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded"
                          >
                            {doctors.map(doc => (
                              <option key={doc} value={doc}>{doc}</option>
                            ))}
                          </select>
                        ) : (
                          appointment.doctor
                        )}
                      </td>
                      
                      {/* Date */}
                      <td className="p-3 text-gray-700">
                        {editingId === appointment.id ? (
                          <div className="flex flex-col">
                            <input
                              type="date"
                              name="date"
                              value={editedAppointment.date}
                              onChange={handleEditChange}
                              min={getTodayDate()}
                              className="w-full px-2 py-1 border rounded"
                            />
                            {dateError && (
                              <span className="text-red-500 text-xs mt-1">{dateError}</span>
                            )}
                          </div>
                        ) : (
                          formatDateForDisplay(appointment.date)
                        )}
                      </td>
                      
                      {/* Time */}
                      <td className="p-3 text-gray-700">
                        {editingId === appointment.id ? (
                          <input
                            type="time"
                            name="time"
                            value={editedAppointment.time}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border rounded"
                          />
                        ) : (
                          formatTimeForDisplay(appointment.time)
                        )}
                      </td>
                      
                      {/* Status */}
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "Approved" 
                            ? "bg-green-100 text-green-800" 
                            : appointment.status === "Declined" || appointment.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : appointment.status === "Cancelled"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="p-3 relative">
                        <div className="dropdown relative">
                          <button 
                            onClick={(e) => toggleDropdown(appointment.id, e)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {dropdownOpen === appointment.id && (
                            <div 
                              className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {editingId === appointment.id ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateAppointment();
                                    }}
                                    disabled={dateError}
                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                      dateError ? "text-gray-400 cursor-not-allowed" : "text-green-600 hover:bg-green-50"
                                    }`}
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelEdit();
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Cancel Edit
                                  </button>
                                </>
                              ) : (
                                <>
                                  {appointment.status === "Pending" && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditAppointment(appointment);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                      >
                                        Update
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCancelAppointment(appointment.id);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteAppointment(appointment.id);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {appointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No appointment history found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentHistory;