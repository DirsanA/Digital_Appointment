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
} from "react-icons/fa";

const Appointments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

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
          to="/logout"
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
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
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
                <span className="text-gray-500 text-xs">
                  Total Appointments
                </span>
                <p className="font-semibold text-gray-800 text-lg">
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
                    <FaSearch className="w-5 h-5 text-gray-400" />
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
                <label htmlFor="filter" className="sr-only text-black-500">
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
            ) : filteredAppointments.length === 0 ? (
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex flex-shrink-0 justify-center items-center bg-blue-100 rounded-full w-10 h-10">
                              <span className="font-medium text-blue-600">
                                {appointment.patient_name
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 text-sm">
                                {appointment.patient_name}
                              </div>
                              <div className="sm:hidden text-gray-500 text-sm">
                                {appointment.department}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900 text-sm">
                            {appointment.department}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900 text-sm">
                            {dayjs(appointment.appointment_date).format(
                              "MMM D, YYYY"
                            )}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {appointment.appointment_time}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900 text-sm">
                            {appointment.patient_email}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {appointment.patient_phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(appointment.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;
