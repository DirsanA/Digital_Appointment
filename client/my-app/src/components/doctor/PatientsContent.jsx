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
    const existingPatient = acc.find(p => 
      Array.from(p.names).some(name => 
        name.toLowerCase() === appointment.patient_name.toLowerCase()
      )
    );
    
    if (!existingPatient) {
      // Add new patient with their first appointment
      acc.push({
        email: new Set([appointment.patient_email]),
        phone: appointment.patient_phone,
        names: new Set([appointment.patient_name]),
        appointments: [{
          date: appointment.appointment_date,
          time: appointment.appointment_time,
          status: appointment.status,
          department: appointment.department,
          patientName: appointment.patient_name,
          email: appointment.patient_email
        }]
      });
    } else {
      // Add new email if it's different
      existingPatient.email.add(appointment.patient_email);
      
      // Add new name if it's different (should be same in this case)
      existingPatient.names.add(appointment.patient_name);
      
      // Add this appointment to existing patient's history
      existingPatient.appointments.push({
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        status: appointment.status,
        department: appointment.department,
        patientName: appointment.patient_name,
        email: appointment.patient_email
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
      Array.from(patient.email).some(email =>
        email.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      patient.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter === "all" || 
      patient.appointments.some(apt => apt.status === statusFilter);

    return searchMatch && statusMatch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-20 bg-gray-50 pb-4">
        {/* Header */}
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="font-bold text-gray-900 text-2xl md:text-3xl">
              My Patients
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              View and manage your patient records
            </p>
          </div>

          <div className="flex sm:flex-row flex-col gap-3 w-full md:w-auto">
            <div className="bg-white shadow-sm px-4 py-3 border border-gray-200 rounded-lg w-full md:w-48">
              <span className="text-gray-500 text-xs">Total Patients</span>
              <p className="font-semibold text-gray-800 text-lg">
                {loading ? (
                  <span className="block bg-gray-200 rounded w-12 h-6 animate-pulse"></span>
                ) : (
                  uniquePatients.length
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
            <div className="flex-1 text-black">
              <label htmlFor="search" className="sr-only">
                Search patients
              </label>
              <div className="relative">
                <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="block bg-gray-50 py-2 pr-3 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-sm"
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block bg-gray-50 text-black py-2 px-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-auto">
        {loading ? (
          <div className="p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-6 bg-white rounded-lg shadow-sm animate-pulse">
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No patients found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPatients.map((patient, index) => (
              <div key={index} className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {Array.from(patient.names)[0]}
                      </h3>
                      <div className="mt-1 space-y-1">
                        <p className="text-gray-600 text-sm">{Array.from(patient.email)[0]}</p>
                        <p className="text-gray-600 text-sm">{patient.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
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

                  {/* Appointments History */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Appointment History</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roll No.</th>
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
                              <td className="px-4 py-2 text-sm text-gray-900">
                                P{String(aptIndex + 1).padStart(3, '0')}
                              </td>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsContent;
