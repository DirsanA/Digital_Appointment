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
  FaSpinner,
} from "react-icons/fa";
import bgImage from "/assets/b4.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientSidebar from "./PatientSidebar";

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
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [patientData, setPatientData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();

  // Fetch departments from the database
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/getAllDepartments"
        );
        if (response.data.success) {
          const deptNames = response.data.departments.map((dept) =>
            typeof dept === "object" ? dept.department_name : dept
          );
          setDepartments(deptNames);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch all doctors from the database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/getAllDoctors"
        );
        if (response.data.success) {
          const doctorsData = response.data.doctors.map((doctor) => ({
            id: doctor.id,
            name: doctor.doctorfullname,
            department: doctor.department,
          }));
          setAllDoctors(doctorsData);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on selected department when editing
  useEffect(() => {
    if (editingId && editedAppointment.department) {
      const filtered = allDoctors.filter(
        (doctor) => doctor.department === editedAppointment.department
      );
      setFilteredDoctors(filtered);

      if (
        filtered.length > 0 &&
        !filtered.some((doc) => doc.id === editedAppointment.doctor_id)
      ) {
        setEditedAppointment((prev) => ({
          ...prev,
          doctor_id: filtered[0].id,
          doctor: filtered[0].name,
        }));
      }
    }
  }, [editedAppointment.department, editingId, allDoctors]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/patient-login");
      return;
    }

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
          setPatientData(response.data.patient);
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

        if (!response.data) {
          throw new Error("No data received from server");
        }

        const formattedAppointments = response.data.map((appt, index) => ({
          id: appt.id,
          patientName: appt.patient_name,
          department: appt.department,
          date: appt.appointment_date,
          email: appt.patient_email,
          doctor_id: appt.doctor_id,
          doctor: appt.doctorfullname,
          time: appt.appointment_time,
          phone: appt.patient_phone,
          status:
            appt.status.charAt(0).toUpperCase() +
            appt.status.slice(1).toLowerCase(),
          uniqueKey: `appt-${index}-${appt.id}`,
        }));
        setAppointments(formattedAppointments);
        setError(null);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load appointments. Please try again."
        );
        if (error.message === "User email not found") {
          navigate("/patient-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
    // Verify appointment still exists in the current state
    const exists = appointments.some((appt) => appt.id === appointment.id);
    if (!exists) {
      alert("This appointment no longer exists. Refreshing the list...");
      window.location.reload();
      return;
    }

    // Convert date to yyyy-MM-dd format for the input field
    const date = new Date(appointment.date);
    const formattedDate = date.toISOString().split("T")[0];

    setEditingId(appointment.id);
    setEditedAppointment({
      ...appointment,
      date: formattedDate,
      doctor_id: appointment.doctor_id, // Ensure we have the doctor_id
    });
    setDateError("");
    setDropdownOpen(null);

    const filtered = allDoctors.filter(
      (doctor) => doctor.department === appointment.department
    );
    setFilteredDoctors(filtered);
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

      const formattedDate = new Date(editedAppointment.date)
        .toISOString()
        .split("T")[0];

      const updateData = {
        department: editedAppointment.department,
        doctor_id: editedAppointment.doctor_id, // Use the doctor_id instead of name
        appointment_date: formattedDate,
        appointment_time: editedAppointment.time,
      };

      const response = await axios.put(
        `http://localhost:5000/appointment/${editingId}`,
        updateData
      );

      if (response.data.success) {
        // Find the updated doctor's name
        const updatedDoctor = allDoctors.find(
          (doc) => doc.id === editedAppointment.doctor_id
        );

        setAppointments(
          appointments.map((appt) =>
            appt.id === editingId
              ? {
                  ...appt,
                  department: editedAppointment.department,
                  doctor_id: editedAppointment.doctor_id,
                  doctor: updatedDoctor ? updatedDoctor.name : appt.doctor,
                  date: formattedDate,
                  time: editedAppointment.time,
                }
              : appt
          )
        );
        setEditingId(null);
        setDateError("");
      } else {
        throw new Error(
          response.data.message || "Failed to update appointment"
        );
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update appointment. Please try again."
      );
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

    if (name === "doctor") {
      // When doctor is changed, update both doctor_id and doctor name
      const selectedDoctor = filteredDoctors.find((doc) => doc.name === value);
      setEditedAppointment((prev) => ({
        ...prev,
        doctor_id: selectedDoctor ? selectedDoctor.id : "",
        [name]: value,
      }));
    } else if (name === "time") {
      const formattedTime = validateAndFormatTime(value);
      setEditedAppointment((prev) => ({
        ...prev,
        [name]: formattedTime,
      }));
    } else {
      setEditedAppointment((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const formatDateForDisplay = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "--:--";

    const timeParts = timeString.split(":");
    return `${timeParts[0]}:${timeParts[1]}`;
  };

  const validateAndFormatTime = (time) => {
    if (!time) return null;

    if (time.includes(":") && time.split(":").length > 2) {
      return time.substring(0, 5);
    }

    if (!time.includes(":") && time.length === 4) {
      return `${time.substring(0, 2)}:${time.substring(2)}`;
    }

    return time;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("patientId");
    navigate("/");
  };

  const handleViewHistory = async (appointment) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/${appointment.id}/history`);
      if (response.data.success) {
        setSelectedAppointment({
          ...appointment,
          history: response.data.history
        });
        setShowHistoryModal(true);
      } else {
        toast.error('No history found for this appointment');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch appointment history');
    }
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
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
        <div className="mx-auto max-w-6xl h-full flex flex-col">
          {/* Welcome Section - Fixed height */}
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

          {/* Appointment History Table - Scrollable area */}
          <div className="bg-white shadow-md p-4 md:p-6 rounded-lg flex-1 flex flex-col overflow-hidden">
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
              <div className="overflow-auto flex-1">
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
                      <th className="p-3 text-left">History</th>
                      <th className="p-3 rounded-r-lg text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr
                        key={appointment.uniqueKey || appointment.id}
                        className="hover:bg-blue-50 border-gray-200 border-b transition-colors"
                      >
                        <td className="p-3 text-gray-700">
                          A{String(index + 1).padStart(3, "0")}
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
                              required
                            >
                              <option value="">Select Department</option>
                              {departments.map((dept, i) => (
                                <option key={`dept-${i}`} value={dept}>
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
                            fetchingDoctors ? (
                              <div className="flex items-center">
                                <FaSpinner className="mr-2 animate-spin" />
                                Loading doctors...
                              </div>
                            ) : (
                              <select
                                name="doctor"
                                value={editedAppointment.doctor}
                                onChange={handleEditChange}
                                className="px-2 py-1 border rounded w-full"
                                required
                                disabled={filteredDoctors.length === 0}
                              >
                                {filteredDoctors.length === 0 ? (
                                  <option value="">
                                    No doctors in this department
                                  </option>
                                ) : (
                                  <>
                                    <option value="">Select Doctor</option>
                                    {filteredDoctors.map((doc) => (
                                      <option
                                        key={`doc-${doc.id}`}
                                        value={doc.name}
                                      >
                                        {doc.name}
                                      </option>
                                    ))}
                                  </>
                                )}
                              </select>
                            )
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
                                required
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
                              required
                              step="1800"
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

                        {/* History */}
                        <td className="p-3">
                          <button
                            onClick={() => handleViewHistory(appointment)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <FaHistory className="mr-2" />
                            View History
                          </button>
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
                                      disabled={
                                        dateError ||
                                        updating ||
                                        !editedAppointment.department ||
                                        !editedAppointment.doctor_id ||
                                        !editedAppointment.date ||
                                        !editedAppointment.time
                                      }
                                      className={`block w-full text-left px-4 py-2 text-sm ${
                                        dateError ||
                                        updating ||
                                        !editedAppointment.department ||
                                        !editedAppointment.doctor_id ||
                                        !editedAppointment.date ||
                                        !editedAppointment.time
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

     {/* History Modal */}
              {showHistoryModal && selectedAppointment && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
                      <button
                        onClick={handleCloseHistoryModal}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>
    
                    {selectedAppointment.history && selectedAppointment.history.length > 0 ? (
                      <div className="space-y-4">
                        {selectedAppointment.history.map((record) => (
                          <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900">Diagnosis</h4>
                              <p className="text-gray-600">{record.diagnosis || 'No diagnosis recorded'}</p>
                            </div>
    
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900">Prescription</h4>
                              <p className="text-gray-600">{record.prescription || 'No prescription recorded'}</p>
                            </div>
    
                            {record.medicine_name && (
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-900">Medication Details</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  <li><span className="font-medium">Medicine:</span> {record.medicine_name}</li>
                                  <li><span className="font-medium">Dosage:</span> {record.medicine_dosage}</li>
                                  <li><span className="font-medium">Frequency:</span> {record.medicine_frequency}</li>
                                  <li><span className="font-medium">Duration:</span> {record.medicine_duration}</li>
                                </ul>
                              </div>
                            )}
    
                            {record.next_appointment_date && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <h4 className="font-medium text-gray-900">Next Appointment</h4>
                                <p className="text-gray-600">
                                  {new Date(record.next_appointment_date).toLocaleDateString()} at {record.next_appointment_time}
                                </p>
                              </div>
                            )}
    
                            <div className="mt-4 text-sm text-gray-500">
                              Recorded on: {new Date(record.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No history found for this appointment.</p>
                      </div>
                    )}
    
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleCloseHistoryModal}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
    </div>
  );
};

export default AppointmentHistory;