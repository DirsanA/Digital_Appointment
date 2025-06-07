import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import {
  FaUserCircle,
  FaCalendarCheck,
  FaUserMd,
  FaUsers,
  FaThLarge,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

const Appointments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/appointments");
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patient_email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patient_phone.includes(searchTerm);

    const matchesFilter =
      filter === "all" ||
      appointment.status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const statusText = {
      pending: "Pending",
      accepted: "Accepted",
      cancelled: "Cancelled",
      completed: "Completed",
    };

    return (
      <span
        className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full border ${
          statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-gray-700"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar - Left Side */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        <div className="overflow-y-auto">
          <h2 className="flex items-center mb-6 p-4 font-bold text-gray-700 text-lg">
            <FaUserCircle className="mr-3 text-blue-500 text-4xl" /> Admin
          </h2>
          <nav className="space-y-2">
            <Link
              to="/AdminDashboard"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaThLarge size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/getAllDoctors"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd size={20} />
              <span>Doctors</span>
            </Link>
            <Link
              to="/Departments"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsers size={20} />
              <span>Departments</span>
            </Link>
            <Link
              to="/Appointments"
              className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md font-semibold text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarCheck size={20} />
              <span>Appointments</span>
            </Link>
            <Link
              to="/admin/doctors"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd size={20} />
              <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link
          to="/"
          className="flex items-center space-x-2 hover:bg-red-50 p-2 rounded-md text-red-500"
          onClick={() => setSidebarOpen(false)}
        >
          <FaSignOutAlt size={20} />
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
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-4 md:p-6 min-h-screen overflow-hidden">
        <div className="flex flex-col mx-auto max-w-6xl h-[calc(100vh-5rem)] md:h-[calc(100vh-2rem)]">
          {/* Fixed Header Section */}
          <div className="flex-none space-y-3 md:space-y-4">
            {/* Header */}
            <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-3 md:gap-4">
              <div>
                <h1 className="font-bold text-gray-900 text-xl md:text-2xl lg:text-3xl">
                  Patient Appointments
                </h1>
                <p className="mt-1 text-gray-500 text-xs md:text-sm">
                  Manage and track all patient appointments
                </p>
              </div>

              <div className="flex sm:flex-row flex-col gap-2 md:gap-3 w-full md:w-auto">
                <div className="bg-white shadow-sm px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg w-full md:w-48">
                  <span className="text-gray-500 text-xs">
                    Total Appointments
                  </span>
                  <p className="font-semibold text-gray-800 text-base md:text-lg">
                    {loading ? (
                      <span className="block bg-gray-200 rounded w-12 h-6 animate-pulse"></span>
                    ) : (
                      appointments.length
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 p-3 md:p-4 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Search and Filter Section */}
            <div className="bg-white shadow-sm rounded-lg">
              <div className="p-3 md:p-4">
                <div className="flex md:flex-row flex-col gap-3 md:gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by patient name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="py-2 pr-4 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black text-sm"
                      />
                      <FaSearch className="top-3 left-3 absolute text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto text-black text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="flex-1 bg-white shadow-md mt-3 md:mt-4 p-2 md:p-4 rounded-lg overflow-hidden">
            <div className="relative h-full">
              <div className="pb-16 md:pb-0 h-full overflow-auto">
                <table className="border border-gray-300 w-full border-collapse">
                  <thead className="top-0 z-10 sticky bg-gray-200">
                    <tr>
                      <th className="px-3 md:px-6 py-2 md:py-3 border-b font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                        Roll No.
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 border-b font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                        Patient Name
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 border-b font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                        Appointment Details
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 border-b font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                        Doctor Name
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 border-b font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 border-b font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      [...Array(5)].map((_, index) => (
                        <tr key={index}>
                          <td colSpan="6" className="px-3 md:px-6 py-3 md:py-4">
                            <div className="flex space-x-4 animate-pulse">
                              <div className="flex-1 space-y-4 py-1">
                                <div className="bg-gray-200 rounded w-3/4 h-4"></div>
                                <div className="space-y-2">
                                  <div className="bg-gray-200 rounded h-4"></div>
                                  <div className="bg-gray-200 rounded w-5/6 h-4"></div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : filteredAppointments.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-3 md:px-6 py-3 md:py-4 text-gray-500 text-center"
                        >
                          No appointments found
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((appointment, index) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="text-gray-900 text-xs md:text-sm">
                              P{String(index + 1).padStart(3, "0")}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900 text-xs md:text-sm">
                              {appointment.patient_name}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="text-gray-900 text-xs md:text-sm">
                              {dayjs(appointment.appointment_date).format(
                                "MMM D, YYYY"
                              )}
                            </div>
                            <div className="text-gray-500 text-xs md:text-sm">
                              {appointment.appointment_time}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            <div className="text-gray-900 text-xs md:text-sm">
                              Dr.{appointment.doctorfullname}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                            {getStatusBadge(appointment.status)}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-gray-500 text-xs md:text-sm whitespace-nowrap">
                            <button
                              onClick={() => handleViewDetails(appointment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Appointment Details Modal */}
          {selectedAppointment && (
            <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
              <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="font-bold text-gray-900 text-2xl">
                      Appointment Details
                    </h2>
                    <button
                      onClick={handleCloseDetails}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Patient Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="flex items-center mb-4 font-semibold text-gray-900 text-lg">
                        <FaUserCircle className="mr-2 text-blue-600" />
                        Patient Information
                      </h3>
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div>
                          <p className="text-gray-500 text-sm">Name</p>
                          <p className="font-medium text-gray-500 text-base">
                            {selectedAppointment.patient_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Email</p>
                          <p className="flex items-center font-medium text-gray-500 text-base">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            {selectedAppointment.patient_email}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Phone</p>
                          <p className="flex items-center font-medium text-gray-500 text-base">
                            <FaPhone className="mr-2 text-gray-400" />
                            +251{selectedAppointment.patient_phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Gender</p>
                          <p className="font-medium text-gray-500 text-base">
                            {selectedAppointment.patient_gender === "Male"
                              ? "Male"
                              : selectedAppointment.patient_gender === "Female"
                              ? "Female"
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="flex items-center mb-4 font-semibold text-gray-900 text-lg">
                        <FaCalendarCheck className="mr-2 text-blue-600" />
                        Appointment Details
                      </h3>
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div>
                          <p className="text-gray-500 text-sm">Date</p>
                          <p className="flex items-center font-medium text-gray-500 text-base">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            {dayjs(selectedAppointment.appointment_date).format(
                              "MMM D, YYYY"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Time</p>
                          <p className="flex items-center font-medium text-gray-500 text-base">
                            <FaClock className="mr-2 text-gray-400" />
                            {selectedAppointment.appointment_time}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Doctor</p>
                          <p className="flex items-center font-medium text-gray-500 text-base">
                            <FaUserMd className="mr-2 text-gray-400" />
                            Dr.{selectedAppointment.doctorfullname}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Department</p>
                          <p className="font-medium text-gray-500 text-base">
                            {selectedAppointment.department}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Status</p>
                          <div className="mt-1">
                            {getStatusBadge(selectedAppointment.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleCloseDetails}
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Appointments;
