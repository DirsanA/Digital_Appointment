import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const PatientsContent = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Get unique patients with all their appointments and names
  const uniquePatients = appointments.reduce((acc, appointment) => {
    const existingPatient = acc.find(p => p.email === appointment.patient_email);
    
    if (!existingPatient) {
      // Add new patient with their first appointment
      acc.push({
        email: appointment.patient_email,
        phone: appointment.patient_phone,
        names: new Set([appointment.patient_name]),
        appointments: [{
          date: appointment.appointment_date,
          time: appointment.appointment_time,
          status: appointment.status,
          department: appointment.department,
          patientName: appointment.patient_name
        }]
      });
    } else {
      // Add new name if it's different
      existingPatient.names.add(appointment.patient_name);
      
      // Add this appointment to existing patient's history
      existingPatient.appointments.push({
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        status: appointment.status,
        department: appointment.department,
        patientName: appointment.patient_name
      });
      
      // Sort appointments by date (most recent first)
      existingPatient.appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return acc;
  }, []);

  // Filter patients based on search term and status
  const filteredPatients = uniquePatients.filter(patient => {
    const searchMatch = searchTerm === "" || 
      Array.from(patient.names).some(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter === "all" || 
      patient.appointments.some(apt => apt.status === statusFilter);

    return searchMatch && statusMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Patients</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 text-black border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-black"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Total Patients:</span> {uniquePatients.length}
              </div>
              <div>
                <span className="font-medium">Total Appointments:</span> {appointments.length}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPatients.map((patient, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Patient Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="mb-2">
                        {Array.from(patient.names).map((name, nameIndex) => (
                          <h3 key={nameIndex} className="font-semibold text-lg text-gray-800">
                            {name}
                            {nameIndex < patient.names.size - 1 && <span className="text-gray-400"> | </span>}
                          </h3>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">{patient.email}</p>
                      <p className="text-gray-600 text-sm">{patient.phone}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Appointments: {patient.appointments.length}
                      </p>
                      <p className="text-sm text-gray-500">
                        Latest Status: {" "}
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          patient.appointments[0].status === "completed" ? "bg-green-100 text-green-800" :
                          patient.appointments[0].status === "cancelled" ? "bg-red-100 text-red-800" :
                          patient.appointments[0].status === "accepted" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {patient.appointments[0].status.charAt(0).toUpperCase() + 
                           patient.appointments[0].status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Appointments History */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patient.appointments.map((apt, aptIndex) => (
                        <tr key={aptIndex} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{apt.patientName}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {new Date(apt.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{apt.time}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{apt.department}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              apt.status === "completed" ? "bg-green-100 text-green-800" :
                              apt.status === "cancelled" ? "bg-red-100 text-red-800" :
                              apt.status === "accepted" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredPatients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" 
                ? "No patients found matching your search criteria."
                : "No patients found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsContent;
