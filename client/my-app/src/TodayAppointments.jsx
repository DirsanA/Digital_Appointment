import React from "react";
import { FaClock, FaUser, FaCalendarAlt, FaSync } from "react-icons/fa";

const TodayAppointments = ({
  appointments = [],
  loading = false,
  onRefresh,
}) => {
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (e) {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md mt-6 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center font-semibold text-gray-800 text-xl">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Today's Appointments
            </h2>
            <button
              className="flex items-center bg-gray-100 px-3 py-1 rounded text-gray-600 text-sm"
              disabled
            >
              <FaSync className="mr-1 animate-spin" />
            </button>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4 animate-pulse">
                <div className="bg-gray-200 rounded-full w-10 h-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 rounded w-3/4 h-4"></div>
                  <div className="bg-gray-200 rounded h-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white shadow-md mt-6 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center font-semibold text-gray-800 text-xl">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Today's Appointments
            </h2>
            <button
              onClick={onRefresh}
              className="flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-blue-600 text-sm"
            >
              <FaSync className="mr-1" /> Refresh
            </button>
          </div>
          <div className="py-8 text-gray-500 text-center">
            No appointments scheduled for today
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md mt-6 rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center font-semibold text-gray-800 text-xl">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Today's Appointments
          </h2>
          <button
            onClick={onRefresh}
            className="flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-blue-600 text-sm"
          >
            <FaSync className="mr-1" /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="divide-y divide-gray-200 min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr
                  key={`${appointment.id}-${appointment.appointment_time}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 justify-center items-center bg-blue-100 rounded-full w-10 h-10">
                        <FaUser className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 text-sm">
                          {appointment.patient_name || "N/A"}
                        </div>
                        <div className="text-gray-500 text-sm">
                          ID: {appointment.patient_id || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 text-sm">
                      {appointment.doctor_name || "N/A"}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {appointment.doctor_specialty || ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm">
                        {formatTime(appointment.appointment_time)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.department && (
                      <span className="inline-flex bg-purple-100 px-2 py-1 rounded-full font-semibold text-purple-800 text-xs leading-5">
                        {appointment.department}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status
                        ? appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1).toLowerCase()
                        : "Scheduled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TodayAppointments;
