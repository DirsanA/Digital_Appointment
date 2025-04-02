import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Sample appointment data
  const appointmentsData = {
    upcoming: [
      {
        id: 1,
        patientName: "John Doe",
        date: "2023-06-10",
        time: "10:00 AM",
        status: "Confirmed",
        reason: "Regular Checkup",
        patientImage: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: 2,
        patientName: "Jane Smith",
        date: "2023-06-12",
        time: "2:30 PM",
        status: "Pending",
        reason: "Consultation",
        patientImage: "https://randomuser.me/api/portraits/women/1.jpg",
      },
    ],
    past: [
      {
        id: 3,
        patientName: "Robert Johnson",
        date: "2023-05-15",
        time: "9:15 AM",
        status: "Completed",
        reason: "Follow-up",
        patientImage: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {
        id: 4,
        patientName: "Emily Davis",
        date: "2023-05-10",
        time: "11:00 AM",
        status: "Completed",
        reason: "Annual Physical",
        patientImage: "https://randomuser.me/api/portraits/women/2.jpg",
      },
    ],
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    // In a real app, you would update the backend here
    console.log(`Changing appointment ${appointmentId} to ${newStatus}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bold text-gray-800 text-2xl">My Appointments</h1>
          <div className="bg-white shadow-sm px-4 py-2 rounded-lg">
            <span className="text-gray-500 text-sm">Today's Date</span>
            <p className="font-semibold text-gray-700">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-gray-200 border-b">
          <nav className="flex space-x-8 -mb-px">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "upcoming"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "past"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Past Appointments
            </button>
          </nav>
        </div>

        {/* Appointment Cards */}
        <div className="space-y-4">
          {appointmentsData[activeTab].length > 0 ? (
            appointmentsData[activeTab].map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white shadow-sm rounded-lg overflow-hidden"
              >
                <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={appointment.patientImage}
                      alt={appointment.patientName}
                      className="rounded-full w-12 h-12 object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {appointment.reason}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:text-right">
                    <p className="font-medium text-gray-900 text-sm">
                      {appointment.date} at {appointment.time}
                    </p>
                    <div className="flex sm:justify-end items-center mt-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 bg-gray-50 px-6 py-3">
                  {activeTab === "upcoming" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(appointment.id, "Confirmed")
                        }
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 shadow-sm px-3 py-1 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-white text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(appointment.id, "Cancelled")
                        }
                        className="inline-flex items-center bg-white hover:bg-gray-50 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() =>
                      navigate(`/patient-profile/${appointment.id}`)
                    }
                    className="inline-flex items-center bg-blue-100 hover:bg-blue-200 px-3 py-1 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-blue-700 text-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white shadow-sm py-12 rounded-lg text-center">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 font-medium text-gray-900 text-sm">
                No appointments
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                {activeTab === "upcoming"
                  ? "You don't have any upcoming appointments."
                  : "You don't have any past appointments."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
