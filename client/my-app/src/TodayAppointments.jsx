// TodayAppointments.jsx
import React from "react";

const TodayAppointments = ({ appointments }) => {
  return (
    <div className="bg-white shadow-md mt-6 p-4 rounded-lg">
      <h3 className="mb-4 font-bold text-lg">Today's Appointments</h3>
      <div className="overflow-x-auto">
        <table className="border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border text-left">Patient</th>
              <th className="p-3 border text-left">Doctor</th>
              <th className="p-3 border text-left">Time</th>
              <th className="p-3 border text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appt, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border">{appt.patient}</td>
                <td className="p-3 border">{appt.doctor}</td>
                <td className="p-3 border">{appt.time}</td>
                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      index % 3 === 0
                        ? "bg-green-100 text-green-800"
                        : index % 3 === 1
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {index % 3 === 0
                      ? "Completed"
                      : index % 3 === 1
                      ? "Pending"
                      : "In Progress"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayAppointments;
