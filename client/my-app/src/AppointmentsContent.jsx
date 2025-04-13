import React, { useState } from "react";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaVenusMars,
  FaUserAlt,
} from "react-icons/fa";

const AppointmentsContent = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 555-123-4567",
      gender: "Male",
      date: "2023-07-15",
      time: "10:00 AM",
      status: "pending",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "+1 555-987-6543",
      gender: "Female",
      date: "2023-07-16",
      time: "02:30 PM",
      status: "pending",
    },
    {
      id: 3,
      firstName: "Robert",
      lastName: "Johnson",
      email: "robert.j@example.com",
      phone: "+1 555-456-7890",
      gender: "Male",
      date: "2023-07-17",
      time: "09:15 AM",
      status: "pending",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAccept = (id) => {
    setAppointments(
      appointments.map((appt) =>
        appt.id === id ? { ...appt, status: "accepted" } : appt
      )
    );
  };

  const handleDecline = (id) => {
    setAppointments(
      appointments.map((appt) =>
        appt.id === id ? { ...appt, status: "declined" } : appt
      )
    );
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      `${appt.firstName} ${appt.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.phone.includes(searchTerm);

    const matchesFilter =
      statusFilter === "all" || appt.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto p-4 md:p-6 max-w-6xl">
      {/* Header Section */}
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-bold text-gray-800 text-2xl md:text-3xl">
            Appointments
          </h1>
          <p className="mt-1 text-gray-500">Manage patient appointments</p>
        </div>

        <div className="flex sm:flex-row flex-col gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients..."
              className="bg-white py-2 pr-4 pl-10 border border-gray-200 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white px-4 py-2 border border-gray-200 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="gap-4 grid grid-cols-12 bg-gray-50 p-4 border-gray-100 border-b font-medium text-gray-500 text-sm">
          <div className="col-span-4">Patient</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-3">Appointment</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Appointments */}
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="items-center gap-4 grid grid-cols-12 hover:bg-gray-50 p-4 border-gray-100 border-b transition-colors"
            >
              {/* Patient */}
              <div className="flex items-center space-x-3 col-span-4">
                <div
                  className={`${
                    appt.gender === "Male"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-pink-100 text-pink-600"
                  } w-10 h-10 rounded-full flex items-center justify-center`}
                >
                  <FaUserAlt />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {appt.firstName} {appt.lastName}
                  </p>
                  <div className="flex items-center mt-1 text-gray-500 text-sm">
                    <FaVenusMars
                      className={`mr-1 ${
                        appt.gender === "Male"
                          ? "text-blue-500"
                          : "text-pink-500"
                      }`}
                    />
                    {appt.gender}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="col-span-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <FaPhone className="mr-2 text-blue-500" />
                  {appt.phone}
                </div>
                <div className="flex items-center mt-1 text-gray-600 text-sm">
                  <FaEnvelope className="mr-2 text-blue-500" />
                  <span className="truncate">{appt.email}</span>
                </div>
              </div>

              {/* Appointment */}
              <div className="col-span-3">
                <div className="flex items-center text-gray-800">
                  <FaCalendarAlt className="mr-2 text-green-500" />
                  {appt.date}
                </div>
                <div className="flex items-center mt-1 text-gray-500 text-sm">
                  <FaClock className="mr-2 text-green-500" />
                  {appt.time}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 col-span-2">
                {appt.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleAccept(appt.id)}
                      className="flex items-center bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium text-green-700 text-sm transition-colors"
                    >
                      <FaCheck className="mr-1" /> Accept
                    </button>
                    <button
                      onClick={() => handleDecline(appt.id)}
                      className="flex items-center bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium text-red-700 text-sm transition-colors"
                    >
                      <FaTimes className="mr-1" /> Decline
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      appt.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-gray-500 text-center">
            No appointments found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsContent;
