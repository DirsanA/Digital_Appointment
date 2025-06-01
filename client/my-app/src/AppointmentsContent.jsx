import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
// comments added new for home page
const AppointmentsContent = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const doctorEmail = localStorage.getItem("doctorEmail");
      const doctorName = localStorage.getItem("doctorName");

      if (!doctorEmail && !doctorName) {
        throw new Error("Doctor information not found");
      }

      const response = await axios.get("http://localhost:5000/appointments");

      // Filter appointments for the current doctor
      const doctorAppointments = response.data.filter(
        (appointment) =>
          appointment.doctorfullname === doctorName ||
          appointment.doctor_email === doctorEmail
      );

      setPatients(doctorAppointments);
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
      // Optimistic UI update
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === id ? { ...patient, status: newStatus } : patient
        )
      );

      // API call to update database
      const response = await axios.patch(
        `http://localhost:5000/appointments/${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);

      // Revert optimistic update
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === id ? { ...patient, status: patient.status } : patient
        )
      );

      setError(err.message || "Failed to update status");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_phone.includes(searchTerm);

    const matchesFilter =
      filter === "all" || patient.status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-gray-50 p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-gray-900 text-2xl md:text-3xl">
            Patient Appointments
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Manage and track all patient appointments
          </p>
        </div>

        <div className="flex sm:flex-row flex-col gap-3 w-full md:w-auto">
          <div className="bg-white shadow-sm px-4 py-3 border border-gray-200 rounded-lg w-full md:w-48">
            <span className="text-gray-500 text-xs">Total Appointments</span>
            <p className="font-semibold text-gray-800 text-lg">
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
        <div className="bg-red-100 mb-4 p-4 border-red-500 border-l-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-sm mb-6 p-4 border border-gray-200 rounded-xl">
        <div className="flex md:flex-row flex-col gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
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
                className="block bg-gray-50 py-2 pr-3 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-black sm:text-sm"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="filter"
              className="block bg-gray-50 py-2 pr-10 pl-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black sm:text-sm text-base"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4 mb-4 animate-pulse">
                <div className="flex-1 space-y-4 py-1">
                  <div className="bg-gray-200 rounded w-3/4 h-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 rounded h-4"></div>
                    <div className="bg-gray-200 rounded w-5/6 h-4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="mx-auto w-12 h-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 font-medium text-gray-900 text-sm">
              No appointments
            </h3>
            <p className="mt-1 text-gray-500 text-sm">
              {searchTerm || filter !== "all"
                ? "No appointments match your search criteria."
                : "No appointments have been scheduled yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-200 min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                    Department
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="hidden lg:table-cell px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-xs text-right uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex flex-shrink-0 justify-center items-center bg-blue-100 rounded-full w-10 h-10">
                          <span className="font-medium text-blue-600">
                            {patient.patient_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 text-sm">
                            {patient.patient_name}
                          </div>
                          <div className="sm:hidden text-gray-500 text-sm">
                            {patient.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 text-sm">
                        {patient.department}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 text-sm">
                        {dayjs(patient.appointment_date).format("MMM D, YYYY")}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {patient.appointment_time}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 text-sm">
                        {patient.patient_email}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {patient.patient_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={patient.status}
                        onChange={(e) =>
                          updateAppointmentStatus(patient.id, e.target.value)
                        }
                        className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                          patient.status === "accepted"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : patient.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : patient.status === "cancelled"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        } border`}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm text-right whitespace-nowrap">
                      <button
                        onClick={() =>
                          updateAppointmentStatus(patient.id, "cancelled")
                        }
                        className="mr-3 text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          updateAppointmentStatus(patient.id, "completed")
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsContent;
