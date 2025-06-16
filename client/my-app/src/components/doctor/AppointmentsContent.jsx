import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import GoogleCalendarButton from '../GoogleCalendarButton';
import { FaHistory, FaTimes } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import AppointmentHistoryModal from "../admin/AppointmentHistoryModal";

const AppointmentsContent = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [showTodayAppointments, setShowTodayAppointments] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [historyData, setHistoryData] = useState({
    prescription: "",
    diagnosis: "",
    medicine: [{ name: "", dosage: "", frequency: "" }],
    next_appointment: { date: "", time: "", notes: "" }
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch appointments on component mount and refresh periodically
  useEffect(() => {
    fetchAppointments();

    // Set up interval to check for new appointments every minute
    const intervalId = setInterval(fetchAppointments, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.relative')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const doctorEmail = localStorage.getItem("doctorEmail");
      const doctorName = localStorage.getItem("doctorName");

      if (!doctorEmail && !doctorName) {
        throw new Error("Doctor information not found");
      }

      const response = await axios.get("http://localhost:5000/appointments");

      // Filter appointments to show only appointments for this doctor, regardless of status
      const doctorAppointments = response.data.filter((appointment) => {
        const isForDoctor =
          appointment.doctorfullname === doctorName ||
          appointment.doctor_email === doctorEmail;
        return isForDoctor;
      });

      // Sort appointments by date (most recent first)
      const sortedAppointments = doctorAppointments.sort((a, b) => {
        return new Date(b.appointment_date) - new Date(a.appointment_date);
      });

      setPatients(sortedAppointments);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      // Update appointment status in database
      const response = await axios.patch(
        `http://localhost:5000/appointments/${id}`,
        {
          status: newStatus,
          processed_at: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update failed");
      }

      // Update the appointment status in the current view without removing it
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === id ? { ...patient, status: newStatus } : patient
        )
      );
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update status");
    }
  };

  const handleAddHistory = (appointment) => {
    setSelectedAppointment(appointment);
    setShowHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedAppointment(null);
  };

  const handleHistoryChange = (field, value) => {
    setHistoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicine = [...historyData.medicine];
    newMedicine[index] = {
      ...newMedicine[index],
      [field]: value
    };
    setHistoryData(prev => ({
      ...prev,
      medicine: newMedicine
    }));
  };

  const addMedicineField = () => {
    setHistoryData(prev => ({
      ...prev,
      medicine: [...prev.medicine, { name: "", dosage: "", frequency: "" }]
    }));
  };

  const removeMedicineField = (index) => {
    setHistoryData(prev => ({
      ...prev,
      medicine: prev.medicine.filter((_, i) => i !== index)
    }));
  };

  const handleSaveHistory = async () => {
    try {
      // Format the data to match server expectations
      const formattedData = {
        prescription: historyData.prescription,
        diagnosis: historyData.diagnosis,
        medicine_name: historyData.medicine[0]?.name || '',
        medicine_dosage: historyData.medicine[0]?.dosage || '',
        medicine_frequency: historyData.medicine[0]?.frequency || '',
        medicine_duration: historyData.medicine[0]?.duration || '',
        next_appointment_date: historyData.next_appointment?.date || '',
        next_appointment_time: historyData.next_appointment?.time || ''
      };

      const response = await axios.post(
        `http://localhost:5000/api/appointments/${selectedAppointment.id}/history`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("History added successfully");
        handleCloseHistoryModal();
        // Refresh appointments list
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error saving history:", error);
      toast.error(error.response?.data?.message || "Failed to save history");
    }
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

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_phone.includes(searchTerm);

    const matchesStatus = filter === "all" || patient.status === filter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <Toaster position="top-right" />
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col" style={{ minHeight: 'calc(100vh - 100px)' }}>
        {/* Fixed Header Section */}
        <div className="bg-gray-50 mb-12 ">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4">
            <div>
              <h1 className="font-bold text-gray-900 text-xl sm:text-2xl md:text-3xl">
                Patient Appointments
              </h1>
              <p className="mt-1 text-gray-500 text-xs sm:text-sm">
                Manage and track all patient appointments
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="bg-white shadow-sm px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg w-full sm:w-48">
                <span className="text-gray-500 text-xs">Total Appointments</span>
                <p className="font-semibold text-gray-800 text-base sm:text-lg">
                  {loading ? (
                    <span className="block bg-gray-200 rounded w-12 h-6 animate-pulse"></span>
                  ) : (
                    patients.length
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 mb-3 sm:mb-4 p-3 sm:p-4 border-red-500 border-l-4 text-red-700 mx-2 sm:mx-4 text-sm">
              <p>{error}</p>
            </div>
          )}

          {/* Filters - Fixed */}
          <div className="bg-white shadow-sm mb-0 p-3 sm:p-4 border border-gray-200 rounded-xl mx-2 sm:mx-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block bg-gray-50 py-1 sm:py-2 pr-2 sm:pr-3 pl-8 sm:pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-black text-xs sm:text-sm"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <label htmlFor="status-filter" className="sr-only">
                  Filter by Status
                </label>
                <select
                  id="status-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-gray-900 text-xs sm:text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="w-full sm:w-48">
                <button
                  onClick={() => setShowTodayAppointments(!showTodayAppointments)}
                  className={`w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-2 border rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${showTodayAppointments ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {showTodayAppointments ? "Show All" : "Show Today"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="flex-1 overflow-auto">
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-200 min-w-full">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                    Patient
                  </th>
                  {!isMobile && (
                    <>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                        Date & Time
                      </th>
                    </>
                  )}
                  <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                    History
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => {
                    const today = dayjs().format("YYYY-MM-DD");
                    const appointmentDate = dayjs(patient.appointment_date).format("YYYY-MM-DD");
                    
                    if (showTodayAppointments && appointmentDate !== today) {
                      return null;
                    }

                    return (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">
                            {patient.patient_name}
                          </div>
                          {!isMobile && (
                            <div className="text-gray-500 text-xs sm:text-sm">
                              {patient.patient_email}
                            </div>
                          )}
                        </td>
                        {!isMobile && (
                          <>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">
                                {patient.department}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">
                                {dayjs(patient.appointment_date).format("MMM D, YYYY")}
                              </div>
                              <div className="text-gray-500 text-xs sm:text-sm">
                                {patient.appointment_time}
                              </div>
                            </td>
                          </>
                        )}
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                          <select
                            value={patient.status}
                            onChange={(e) => updateAppointmentStatus(patient.id, e.target.value)}
                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 sm:p-2 ${
                              patient.status === "accepted" ? "bg-green-100 text-green-800" :
                              patient.status === "cancelled" ? "bg-red-100 text-red-800" : ""
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                          <div className="relative">
                            <button
                              onClick={() => setDropdownOpen(dropdownOpen === patient.id ? null : patient.id)}
                              className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              {isMobile ? <FaHistory /> : (
                                <>
                                  <FaHistory className="mr-1 sm:mr-2" />
                                  History
                                </>
                              )}
                            </button>
                            {dropdownOpen === patient.id && (
                              <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="fixed inset-0 backdrop-blur-sm" onClick={() => setDropdownOpen(null)}></div>
                                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md transform transition-all">
                                  <div className="p-3 sm:p-4 border-b border-gray-200">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">History Options</h3>
                                  </div>
                                  <div className="p-2">
                                    <button
                                      onClick={() => {
                                        handleAddHistory(patient);
                                        setDropdownOpen(null);
                                      }}
                                      className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                                    >
                                      <FaHistory className="mr-2 sm:mr-3 text-blue-500" />
                                      Add History
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleViewHistory(patient);
                                        setDropdownOpen(null);
                                      }}
                                      className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                                    >
                                      <FaHistory className="mr-2 sm:mr-3 text-blue-500" />
                                      View History
                                    </button>
                                  </div>
                                  <div className="p-2 border-t border-gray-200">
                                    <button
                                      onClick={() => setDropdownOpen(null)}
                                      className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={isMobile ? 4 : 6} className="px-3 sm:px-6 py-4 text-center text-gray-500 text-xs sm:text-sm">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && selectedAppointment && (
        <div className="z-50 fixed inset-0 flex justify-center items-center backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {selectedAppointment.history ? 'Appointment History' : 'Add Appointment History'}
              </h3>
              <button
                onClick={handleCloseHistoryModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {selectedAppointment.history ? (
              <AppointmentHistoryModal
                showModal={showHistoryModal}
                selectedAppointment={selectedAppointment}
                onClose={handleCloseHistoryModal}
                isLoading={false}
              />
            ) : (
              // Add History Mode
              <div className="space-y-3 sm:space-y-4">
                {/* Diagnosis */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Diagnosis</h4>
                  <textarea
                    value={historyData.diagnosis}
                    onChange={(e) => handleHistoryChange('diagnosis', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black text-xs sm:text-sm"
                    rows="3"
                    placeholder="Enter diagnosis..."
                  />
                </div>

                {/* Prescription */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Prescription</h4>
                  <textarea
                    value={historyData.prescription}
                    onChange={(e) => handleHistoryChange('prescription', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black text-xs sm:text-sm"
                    rows="3"
                    placeholder="Enter prescription..."
                  />
                </div>

                {/* Medication Details */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">Medication Details</h4>
                    <button
                      onClick={addMedicineField}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Medicine
                    </button>
                  </div>
                  {historyData.medicine.map((med, index) => (
                    <div key={index} className="mb-3 sm:mb-4 p-2 sm:p-3 bg-white rounded border border-gray-200">
                      <div className="flex justify-between items-center mb-1 sm:mb-2">
                        <h5 className="font-medium text-gray-700 text-xs sm:text-sm">Medicine {index + 1}</h5>
                        {index > 0 && (
                          <button
                            onClick={() => removeMedicineField(index)}
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm text-gray-600 mb-1">Name</label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                            className="w-full p-1 sm:p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black text-xs sm:text-sm"
                            placeholder="Medicine name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm text-gray-600 mb-1">Dosage</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                            className="w-full p-1 sm:p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black text-xs sm:text-sm"
                            placeholder="e.g., 500mg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm text-gray-600 mb-1">Frequency</label>
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                            className="w-full p-1 sm:p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black text-xs sm:text-sm"
                            placeholder="e.g., Twice daily"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm text-gray-600 mb-1">Duration</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                            className="w-full p-1 sm:p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black text-xs sm:text-sm"
                            placeholder="e.g., 7 days"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Appointment */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Next Appointment</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={historyData.next_appointment.date}
                        onChange={(e) => handleHistoryChange('next_appointment', { ...historyData.next_appointment, date: e.target.value })}
                        className="w-full p-1 sm:p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">Time</label>
                      <input
                        type="time"
                        value={historyData.next_appointment.time}
                        onChange={(e) => handleHistoryChange('next_appointment', { ...historyData.next_appointment, time: e.target.value })}
                        className="w-full p-1 sm:p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black text-xs sm:text-sm"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">Notes</label>
                      <textarea
                        value={historyData.next_appointment.notes}
                        onChange={(e) => handleHistoryChange('next_appointment', { ...historyData.next_appointment, notes: e.target.value })}
                        className="w-full p-1 sm:p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black text-xs sm:text-sm"
                        rows="2"
                        placeholder="Add any notes for the next appointment..."
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
                  <button
                    onClick={handleCloseHistoryModal}
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveHistory}
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm"
                  >
                    Save History
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsContent;