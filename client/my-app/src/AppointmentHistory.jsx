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
  FaSpinner,
} from "react-icons/fa";
import bgImage from "./assets/b4.jpg";

const AppointmentHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedAppointment, setEditedAppointment] = useState({});
  const [dateError, setDateError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  // Fetch departments from the database
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/getAllDepartments"
        );
        if (response.data.success) {
          setDepartments(response.data.departments);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch doctors from the database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/getAllDoctors"
        );
        if (response.data.success) {
          const doctorsData = response.data.doctors.map((doctor) => ({
            id: doctor.id,
            name: doctor.doctorfullname, // Use doctorfullname consistently
          }));
          console.log("Fetched doctors:", doctorsData); // For debugging
          setDoctors(doctorsData);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

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
          setPatientName(response.data.patient.full_name);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch patient details"
          );
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("patientId");
          navigate("/patient-login");
        }
      }
    };

    fetchPatientDetails();
  }, [navigate]);

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          throw new Error("User email not found");
        }

        const response = await axios.get(
          `http://localhost:5000/appointments?patient_email=${userEmail}`
        );
        const formattedAppointments = response.data.map((appt) => ({
          id: appt.id,
          patientName: appt.patient_name,
          department: appt.department,
          date: appt.appointment_date,
          email: appt.patient_email,
          doctor: appt.doctorfullname,
          time: appt.appointment_time,
          phone: appt.patient_phone,
          status:
            appt.status.charAt(0).toUpperCase() +
            appt.status.slice(1).toLowerCase(),
        }));
        setAppointments(formattedAppointments);
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments. Please try again later.");
        if (error.message === "User email not found") {
          navigate("/patient-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        setUpdating(true);
        await axios.patch(`http://localhost:5000/appointment/${id}`, {
          status: "cancelled",
        });
        setAppointments(
          appointments.map((appt) =>
            appt.id === id ? { ...appt, status: "Cancelled" } : appt
          )
        );
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
        await axios.delete(`http://localhost:5000/appointment/${id}`);
        setAppointments(appointments.filter((appt) => appt.id !== id));
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
    setEditedAppointment({ ...appointment });
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

      await axios.put(`http://localhost:5000/appointment/${editingId}`, {
        patient_name: editedAppointment.patientName,
        department: editedAppointment.department,
        appointment_date: editedAppointment.date,
        patient_email: editedAppointment.email,
        doctorfullname: editedAppointment.doctor, // Use doctorfullname consistently
        appointment_time: editedAppointment.time,
        patient_phone: editedAppointment.phone,
        status: editedAppointment.status || "pending",
      });

      setAppointments(
        appointments.map((appt) =>
          appt.id === editingId
            ? {
                ...editedAppointment,
                doctor: editedAppointment.doctor,
              }
            : appt
        )
      );
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
    setEditedAppointment({
      ...editedAppointment,
      [name]: value,
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
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeForDisplay = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-between items-center bg-white shadow-md p-4">
        <div className="flex items-center">
          <FaUserCircle className="mr-3 text-blue-500 text-2xl" />
          <h1 className="font-bold text-blue-600 text-lg">
            {patientName || "Loading..."}
          </h1>
        </div>
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
        } md:relative md:translate-x-0 md:w-1/4`}
      >
        <div className="overflow-y-auto">
          <div className="flex items-center mt-12 md:mt-0 mb-6 p-4">
            <div className="flex items-center">
              <FaUserCircle className="mr-3 text-blue-500 text-4xl" />
              <div>
                <h1 className="font-bold text-blue-600 text-xl">
                  {patientName || "Loading..."}
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
          to="/"
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
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
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
              Welcome {patientName || "Loading..."}
            </h2>
            <p className="mt-2 text-blue-500">
              Manage your medical appointments, you can update, delete and
              cancel your appointments.
            </p>
          </div>

          {/* Appointment History Table */}
          <div className="bg-white shadow-md p-4 md:p-6 rounded-lg">
            <h3 className="flex items-center mb-6 font-semibold text-gray-800 text-xl">
              <FaHistory className="mr-2 text-blue-600" />
              Your Appointments
            </h3>

            {loading ? (
              <div className="py-8 text-gray-500 text-center">
                <FaSpinner className="inline-block mr-2 animate-spin" />
                Loading appointments...
              </div>
            ) : error ? (
              <div className="py-8 text-red-500 text-center">
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
                      <th className="p-3 rounded-l-lg text-left">Roll No.</th>
                      <th className="p-3 text-left">Patient</th>
                      <th className="p-3 text-left">Department</th>
                      <th className="p-3 text-left">Doctor</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Time</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 rounded-r-lg text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr
                        key={appointment.id}
                        className="hover:bg-blue-50 border-gray-200 border-b transition-colors"
                      >
                        <td className="p-3 text-gray-700">
                          A{String(index + 1).padStart(3, '0')}
                        </td>
                        <td className="p-3 text-gray-700">
                          {appointment.patientName}
                        </td>

                        {/* Department */}
                        <td className="p-3 text-gray-700">
                          {editingId === appointment.id ? (
                            <select
                              name="department"
                              value={editedAppointment.department}
                              onChange={handleEditChange}
                              className="px-2 py-1 border rounded w-full"
                            >
                              {departments.map((dept) => (
                                <option key={dept} value={dept}>
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
                              className="px-2 py-1 border rounded w-full"
                            >
                              <option value="">Select Doctor</option>
                              {doctors.map((doc) => (
                                <option key={doc.id} value={doc.name}>
                                  {doc.name}
                                </option>
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
                                className="px-2 py-1 border rounded w-full"
                              />
                              {dateError && (
                                <span className="mt-1 text-red-500 text-xs">
                                  {dateError}
                                </span>
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
                              className="px-2 py-1 border rounded w-full"
                            />
                          ) : (
                            formatTimeForDisplay(appointment.time)
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status.toLowerCase() === "approved"
                                ? "bg-green-100 text-green-800"
                                : appointment.status.toLowerCase() ===
                                    "declined" ||
                                  appointment.status.toLowerCase() ===
                                    "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="relative p-3">
                          <div className="relative dropdown">
                            <button
                              onClick={(e) => toggleDropdown(appointment.id, e)}
                              className="hover:bg-gray-50 p-1 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                              disabled={updating}
                            >
                              {updating && dropdownOpen === appointment.id ? (
                                <FaSpinner className="w-5 h-5 animate-spin" />
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              )}
                            </button>
                            {dropdownOpen === appointment.id && (
                              <div
                                className="right-0 z-10 absolute bg-white shadow-lg mt-2 border border-gray-200 rounded-md w-48 dropdown-menu"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {editingId === appointment.id ? (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateAppointment();
                                      }}
                                      disabled={dateError || updating}
                                      className={`block w-full text-left px-4 py-2 text-sm ${
                                        dateError || updating
                                          ? "text-gray-400 cursor-not-allowed"
                                          : "text-green-600 hover:bg-green-50"
                                      }`}
                                    >
                                      {updating ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelEdit();
                                      }}
                                      disabled={updating}
                                      className="block hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left"
                                    >
                                      Cancel Edit
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {appointment.status.toLowerCase() ===
                                      "pending" && (
                                      <>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditAppointment(appointment);
                                          }}
                                          disabled={updating}
                                          className="block hover:bg-blue-50 px-4 py-2 w-full text-blue-600 text-sm text-left"
                                        >
                                          Update
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCancelAppointment(
                                              appointment.id
                                            );
                                          }}
                                          disabled={updating}
                                          className="block hover:bg-red-50 px-4 py-2 w-full text-red-600 text-sm text-left"
                                        >
                                          Cancel Appointment
                                        </button>
                                      </>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAppointment(appointment.id);
                                      }}
                                      disabled={updating}
                                      className="block hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left"
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
              <div className="py-8 text-gray-500 text-center">
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
//comment
