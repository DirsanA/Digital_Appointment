
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {FaCalendarPlus,FaHistory,FaUserCircle,FaPowerOff,FaBars,FaTimes,FaSpinner} from "react-icons/fa";
import bgImage from "./assets/b4.jpg";

const AppointmentHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedAppointment, setEditedAppointment] = useState({ patientName: "", department: "", date: "", email: "", doctor: "", time: "", phone: "", gender: "" });
  const [dateError, setDateError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);

  const currentPatientName = "Abenezer";

  const department = ["Cardiology", "Neurology", "Orthopedics","pedatrics"];

  // Fetch departments and doctors when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try fetching departments from API, fallback to local data if fails
        try {
          const deptResponse = await fetch("http://localhost:5000/admin/getAllDepartments");
          if (deptResponse.ok) {
            const deptData = await deptResponse.json();
            setDepartments(deptData.department || []);
          } else {
            setDepartments(department);
          }
        } catch (deptError) {
          console.log("Using fallback departments");
          setDepartments(department);
        }
    
        // Rest of your data fetching
        const apptResponse = await fetch("http://localhost:5000/appointments");
        if (!apptResponse.ok) throw new Error("Failed to fetch appointments");
        const apptData = await apptResponse.json();
        
        const formattedAppointments = apptData.map(appt => ({
          id: appt.id,
          patientName: appt.patient_name,
          department: appt.department,
          date: appt.appointment_date,
          email: appt.patient_email,
          doctor: `${appt.doctor_id}|${appt.doctor_name}`,
          time: appt.appointment_time || '00:00', // Added fallback time
          phone: appt.patient_phone,
          gender: appt.patient_gender,
          status: appt.status || 'Pending'
        }));
        
        setAppointments(formattedAppointments);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch doctors when department changes during edit
  useEffect(() => {
    const fetchDoctorsByDepartment = async () => {
      if (!editedAppointment.department) {
        setDoctors([]);
        return;
      }

      try {
        setFetchingDoctors(true);
        const response = await fetch(
          `http://localhost:5000/getDoctorsByDepartment?department=${editedAppointment.department}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setFetchingDoctors(false);
      }
    };

    if (editingId) {
      fetchDoctorsByDepartment();
    }
  }, [editedAppointment.department, editingId]);

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

  const handleCancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        setUpdating(true);
        const response = await fetch(`http://localhost:5000/appointments/${id}`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ 
            status: "Cancelled" 
          })
        });
  
        if (!response.ok) {
          throw new Error("Failed to cancel appointment");
        }
  
        setAppointments(appointments.map(appt => 
          appt.id === id ? { ...appt, status: "Cancelled" } : appt
        ));
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        alert("Failed to cancel appointment. Please try again.");
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        setUpdating(true);
        const response = await fetch(`http://localhost:5000/appointment/${id}`, {
          method: "DELETE"
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete appointment");
        }
  
        // Remove the deleted appointment from state
        setAppointments(appointments.filter(appt => appt.id !== id));
      } catch (error) {
        console.error("Error deleting appointment:", error);
        alert("Failed to delete appointment. Please try again.");
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingId(appointment.id);
    setEditedAppointment({
      ...appointment,
      department: appointment.department,
      doctor: appointment.doctor
    });
    setDateError("");
    setDropdownOpen(null);
  };

  const validateDate = (date) => {
    const today = new Date(getTodayDate());
    const selectedDate = new Date(date);
    return selectedDate >= today;
  };

  const handleUpdateAppointment = async () => {
    if (!validateDate(editedAppointment.date)) {
      setDateError("Please select a future date");
      return;
    }
    
    try {
      setUpdating(true);
      
      // Extract doctor ID and name
      const [doctorId, doctorName] = editedAppointment.doctor.split("|");
      
      // Prepare the update data
      const updateData = {
        patient_name: editedAppointment.patientName,
        department: editedAppointment.department,
        appointment_date: editedAppointment.date,
        patient_email: editedAppointment.email,
        doctor_id: doctorId,
        doctor_name: doctorName,
        appointment_time: editedAppointment.time,
        patient_phone: editedAppointment.phone,
        patient_gender: editedAppointment.gender,
        status: 'Pending' // Reset status when updating
      };
  
      // Send update request to backend
      const response = await fetch(`http://localhost:5000/appointments/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });
  
      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }
  
      // Update local state with the updated appointment
      setAppointments(appointments.map(appt => 
        appt.id === editingId ? { 
          ...appt,
          ...updateData,
          doctor: `${doctorId}|${doctorName}`,
          status: 'Pending' // Reset status
        } : appt
      ));
      
      setEditingId(null);
      setDateError("");
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDateError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedAppointment(prev => ({ 
      ...prev, 
      [name]: value 
    }));

    if (name === "date") {
      setDateError(validateDate(value) ? "" : "Please select a future date");
    }
  };

  const formatDateForDisplay = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "--:-- --"; // Handle undefined/null
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString; // Return original if formatting fails
    }
  };

  // Rest of your component code remains the same...
  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 right-0 left-0 z-10 flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-gray-700"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        <div className="overflow-y-auto">
          <div className="flex items-center mt-12 md:mt-0 mb-6 p-4">
            <div className="flex items-center">
              <FaUserCircle className="mr-3 text-blue-500 text-4xl" />
              <div>
                <h1 className="font-bold text-blue-600 text-xl">
                  {currentPatientName}
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
              className="flex items-center space-x-2 font-bold text-blue-500"
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
          className="md:hidden z-10 fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:mr-0 p-6 overflow-y-auto">
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
              Welcome {currentPatientName}
            </h2>
            <p className="mt-2 text-blue-500">
              View and manage your appointment history
            </p>
          </div>

          {/* Appointment History Table */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="flex items-center mb-6 font-semibold text-gray-800 text-xl">
              <FaHistory className="mr-2 text-blue-600" />
              Your Appointments
            </h3>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <FaSpinner className="animate-spin inline-block mr-2" />
                Loading appointments...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                {error}
                <button 
                  onClick={() => window.location.reload()} 
                  className="ml-2 text-blue-500 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
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
                              className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                              required
                            >
                              <option value="">Select Department</option>
                              {department.map((dept, idx) => (
                                <option key={idx} value={dept}>
                                  {dept}
                                </option>
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
                              className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                              required
                              disabled={!editedAppointment.department || fetchingDoctors}
                            >
                              <option value="">Select Doctor</option>
                              {fetchingDoctors ? (
                                <option value="" disabled>Loading doctors...</option>
                              ) : (
                                doctors.map((doctor) => (
                                  <option key={doctor.id} value={`${doctor.id}|${doctor.name}`}>
                                    {doctor.name}
                                  </option>
                                ))
                              )}
                            </select>
                          ) : (
                            appointment.doctor.split("|")[1] // Display just the doctor name
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
                                className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                                required
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
                              className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                              required
                            />
                          ) : (
                            formatTimeForDisplay(appointment.time)
                          )}
                        </td>
                        
                        {/* Status */}
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status.toLowerCase() === "approved" 
                              ? "bg-green-100 text-green-800" 
                              : appointment.status.toLowerCase() === "cancelled"
                              ? "bg-red-100 text-red-800"
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
                              disabled={updating}
                            >
                              {updating && dropdownOpen === appointment.id ? (
                                <FaSpinner className="animate-spin h-5 w-5" />
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              )}
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
                                      disabled={dateError || updating || !editedAppointment.doctor}
                                      className={`block w-full text-left px-4 py-2 text-sm ${
                                        dateError || updating || !editedAppointment.doctor ? "text-gray-400 cursor-not-allowed" : "text-green-600 hover:bg-green-50"
                                      }`}
                                    >
                                      {updating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelEdit();
                                      }}
                                      disabled={updating}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Cancel Edit
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {appointment.status.toLowerCase() === "pending" && (
                                      <>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditAppointment(appointment);
                                          }}
                                          disabled={updating}
                                          className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                        >
                                          Update
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCancelAppointment(appointment.id);
                                          }}
                                          disabled={updating}
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
                                      disabled={updating}
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
            )}
            {!loading && appointments.length === 0 && !error && (
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
