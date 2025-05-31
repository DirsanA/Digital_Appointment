import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientsContent = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        const doctorAppointments = response.data.filter(appointment => 
          appointment.doctorfullname === doctorName || 
          appointment.doctor_email === doctorEmail
        );
        
        setAppointments(doctorAppointments);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Get unique patients from appointments
  const uniquePatients = Array.from(new Set(appointments.map(a => a.patient_email)))
    .map(email => {
      const appointment = appointments.find(a => a.patient_email === email);
      return {
        name: appointment.patient_name,
        email: appointment.patient_email,
        phone: appointment.patient_phone,
        lastVisit: appointment.appointment_date,
        status: appointment.status
      };
    });

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
            {loading ? (
              <span className="block bg-gray-200 rounded w-12 h-6 animate-pulse"></span>
            ) : (
              uniquePatients.length
            )}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 mb-4 p-4 border-red-500 border-l-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

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
              {uniquePatients.map((patient, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 text-sm whitespace-nowrap">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {patient.email}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        patient.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : patient.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : patient.status === "accepted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
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
