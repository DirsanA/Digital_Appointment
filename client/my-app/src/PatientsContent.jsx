import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientsContent = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center space-y-3 md:space-y-0">
        <h1 className="font-bold text-gray-800 text-2xl md:text-3xl">
          My Patients
        </h1>
        <div className="bg-white shadow-md px-4 md:px-6 py-2 md:py-3 rounded-lg w-full md:w-auto">
          <span className="text-gray-500 text-xs md:text-sm">
            Total Patients
          </span>
          <p className="font-semibold text-gray-700 text-md md:text-lg">
            {appointments.length}
          </p>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white shadow-md mt-6 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="divide-y divide-gray-200 min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 text-sm whitespace-nowrap">
                    {appt.patient_name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {appt.patient_email}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {appt.patient_phone}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {appt.appointment_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        appt.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : appt.status === "declined"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PatientsContent;
