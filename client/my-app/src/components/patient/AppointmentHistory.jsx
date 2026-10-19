import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHistory,
  FaUserCircle,
  FaPowerOff,
  FaBars,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientSidebar from "./PatientSidebar";
import AppointmentHistoryModal from "../admin/AppointmentHistoryModal";
import bgImage from "/assets/b4.jpg";

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
        toast.error("Failed to cancel appointment. Please try again.");
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
        toast.error("Failed to delete appointment. Please try again.");
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleEditAppointment = (appointment) => {
    const exists = appointments.some((appt) => appt.id === appointment.id);
    if (!exists) {
      toast.error("This appointment no longer exists. Refreshing the list...");
      window.location.reload();
      return;
    }

    const date = new Date(appointment.date);
    const formattedDate = date.toISOString().split("T")[0];

    setEditingId(appointment.id);
    setEditedAppointment({
      ...appointment,
      date: formattedDate,
      doctor_id: appointment.doctor_id,
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
        doctor_id: editedAppointment.doctor_id,
        appointment_date: formattedDate,
        appointment_time: editedAppointment.time,
      };

      const response = await axios.put(
        `http://localhost:5000/appointment/${editingId}`,
        updateData
      );

      if (response.data.success) {
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
        toast.success("Appointment updated successfully");
      } else {
        throw new Error(
          response.data.message || "Failed to update appointment"
        );
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(
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
      const response = await axios.get(
        `http://localhost:5000/api/appointments/${appointment.id}/history`
      );
      if (response.data.success) {
        setSelectedAppointment({
          ...appointment,
          history: response.data.history,
        });
        setShowHistoryModal(true);
      } else {
        toast.error("No history found for this appointment");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to fetch appointment history");
    }
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <ToastContainer />

      <PatientSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        patientData={patientData}
        handleLogout={handleLogout}
      />

      <main className="flex-1 mt-16 md:mt-0 md:ml-30 overflow-x-auto">
        <div className="p-2 md:p-6 w-full h-full">
          <div
            className="relative flex flex-col justify-center shadow-md p-6 rounded-lg w-full h-48 md:h-60 text-white"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="font-bold text-gray-600 text-3xl">
              Welcome, {patientName || "Patient"}
            </h2>
            <p className="mt-2 text-gray-600 text-sm">
              Manage your medical appointments - update, delete, or cancel them.
            </p>
          </div>

          <div className="flex flex-col bg-white shadow-md p-4 md:p-6 rounded-lg w-full">
            <h3 className="flex items-center mb-4 md:mb-6 font-semibold text-gray-800 text-lg md:text-xl">
              <FaHistory className="mr-2 text-gray-600" />
              Your Appointments
            </h3>

            {loading ? (
              <div className="py-8 text-gray-500 text-sm md:text-base text-center">
                <FaSpinner className="inline-block mr-2 animate-spin" />
                Loading appointments...
              </div>
            ) : error ? (
              <div className="py-8 text-red-500 text-sm md:text-base text-center">
                {error}
                <button
                  onClick={() => window.location.reload()}
                  className="ml-2 text-blue-500 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="overflow-x-auto">
                  <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                    <table className="w-full min-w-[1200px] border-collapse">
                      <thead className="top-0 z-10 sticky">
                        <tr className="bg-blue-600 text-white">
                          <th className="p-2 md:p-3 rounded-l-lg text-xs md:text-sm text-left">
                            Roll No.
                          </th>
                          <th className="p-2 md:p-3 text-xs md:text-sm text-left">
                            Patient
                          </th>
                          <th className="hidden md:table-cell p-3 text-sm text-left">
                            Department
                          </th>
                          <th className="p-2 md:p-3 text-xs md:text-sm text-left">
                            Doctor
                          </th>
                          <th className="p-2 md:p-3 text-xs md:text-sm text-left">
                            Date
                          </th>
                          <th className="p-2 md:p-3 text-xs md:text-sm text-left">
                            Time
                          </th>
                          <th className="p-2 md:p-3 text-xs md:text-sm text-left">
                            Status
                          </th>
                          <th className="p-2 md:p-3 text-xs md:text-sm text-left">
                            History
                          </th>
                          <th className="p-2 md:p-3 rounded-r-lg text-xs md:text-sm text-left">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="overflow-y-auto">
                        {appointments.map((appointment, index) => (
                          <tr
                            key={appointment.uniqueKey || appointment.id}
                            className="hover:bg-blue-50 border-gray-200 border-b"
                          >
                            <td className="p-2 md:p-3 text-gray-700 text-xs md:text-sm">
                              A{String(index + 1).padStart(3, "0")}
                            </td>
                            <td className="p-2 md:p-3 text-gray-700 text-xs md:text-sm">
                              {appointment.patientName}
                            </td>
                            <td className="hidden md:table-cell p-3 text-gray-700 text-sm">
                              {editingId === appointment.id ? (
                                <select
                                  name="department"
                                  value={editedAppointment.department}
                                  onChange={handleEditChange}
                                  className="px-2 py-1 border rounded w-full text-sm"
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
                            <td className="p-2 md:p-3 text-gray-700 text-xs md:text-sm">
                              {editingId === appointment.id ? (
                                <select
                                  name="doctor"
                                  value={editedAppointment.doctor}
                                  onChange={handleEditChange}
                                  className="px-2 py-1 border rounded w-full text-sm"
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
                              ) : (
                                appointment.doctor
                              )}
                            </td>
                            <td className="p-2 md:p-3 text-gray-700 text-xs md:text-sm">
                              {editingId === appointment.id ? (
                                <div className="flex flex-col">
                                  <input
                                    type="date"
                                    name="date"
                                    value={editedAppointment.date}
                                    onChange={handleEditChange}
                                    min={getTodayDate()}
                                    className="px-2 py-1 border rounded w-full text-sm"
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
                            <td className="p-2 md:p-3 text-gray-700 text-xs md:text-sm">
                              {editingId === appointment.id ? (
                                <input
                                  type="time"
                                  name="time"
                                  value={editedAppointment.time}
                                  onChange={handleEditChange}
                                  className="px-2 py-1 border rounded w-full text-sm"
                                  required
                                  step="1800"
                                />
                              ) : (
                                formatTimeForDisplay(appointment.time)
                              )}
                            </td>
                            <td className="p-2 md:p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  appointment.status.toLowerCase() ===
                                  "approved"
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
                            <td className="p-2 md:p-3">
                              <button
                                onClick={() => handleViewHistory(appointment)}
                                className="inline-flex items-center bg-blue-50 hover:bg-blue-100 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium text-blue-600 text-xs md:text-sm"
                              >
                                <FaHistory className="mr-1 md:mr-2" />
                                View History
                              </button>
                            </td>
                            <td className="relative p-2 md:p-3">
                              <div className="relative">
                                <button
                                  onClick={(e) =>
                                    toggleDropdown(appointment.id, e)
                                  }
                                  className="hover:bg-gray-50 p-1 rounded-full text-gray-500 hover:text-gray-700"
                                  disabled={updating}
                                >
                                  {updating &&
                                  dropdownOpen === appointment.id ? (
                                    <FaSpinner className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 md:w-5 h-4 md:h-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                  )}
                                </button>
                                {dropdownOpen === appointment.id && (
                                  <div
                                    className="right-0 z-10 absolute bg-white shadow-lg mt-2 border border-gray-200 rounded-md w-40 md:w-48"
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
                                          className={`block w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm ${
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
                                          {updating
                                            ? "Saving..."
                                            : "Save Changes"}
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCancelEdit();
                                          }}
                                          disabled={updating}
                                          className="block hover:bg-gray-100 px-3 md:px-4 py-2 w-full text-gray-700 text-xs md:text-sm text-left"
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
                                                handleEditAppointment(
                                                  appointment
                                                );
                                              }}
                                              disabled={updating}
                                              className="block hover:bg-blue-50 px-3 md:px-4 py-2 w-full text-blue-600 text-xs md:text-sm text-left"
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
                                              className="block hover:bg-red-50 px-3 md:px-4 py-2 w-full text-red-600 text-xs md:text-sm text-left"
                                            >
                                              Cancel Appointment
                                            </button>
                                          </>
                                        )}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAppointment(
                                              appointment.id
                                            );
                                          }}
                                          disabled={updating}
                                          className="block hover:bg-gray-100 px-3 md:px-4 py-2 w-full text-gray-700 text-xs md:text-sm text-left"
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
                </div>
              </div>
            )}

            {!loading && appointments.length === 0 && !error && (
              <div className="py-8 text-gray-500 text-sm md:text-base text-center">
                No appointment history found
              </div>
            )}
          </div>
        </div>
      </main>

      <AppointmentHistoryModal
        showModal={showHistoryModal}
        selectedAppointment={selectedAppointment}
        onClose={handleCloseHistoryModal}
      />
    </div>
  );
};

export default AppointmentHistory;
