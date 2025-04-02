import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarPlus, FaHistory, FaUserCircle, FaPowerOff, FaBars, FaTimes } from "react-icons/fa";
import bgImage from "./assets/b4.jpg";

const AppointmentHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const patientName = "Abenezer"; // Replace with dynamic patient data
  const appointments = [
    {
      patientName: "Abenezer",
      department: "Cardiology",
      date: "April 5, 2025",
      email: "abenezer@example.com",
      doctor: "Dr. Desu",
      time: "10:00 AM",
      phone: "090742",
      status: "Completed"
    },
    {
      patientName: "Abenezer",
      department: "Neurology",
      date: "April 10, 2025",
      email: "abenezer@example.com",
      doctor: "Dr. Elias",
      time: "2:30 PM",
      phone: "090742",
      status: "Upcoming"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10 flex justify-between items-center">
        <div className="flex items-center">
          <FaUserCircle className="text-blue-500 text-2xl mr-3" />
          <h1 className="text-lg font-bold text-blue-600">{patientName}</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-1/4`}>
        <div className="overflow-y-auto">
          <div className="flex items-center mb-6 p-4 md:mt-0 mt-12">
            <div className="flex items-center">
              <FaUserCircle className="text-blue-500 text-4xl mr-3" />
              <div>
                <h1 className="text-xl font-bold text-blue-600">{patientName}</h1>
                <p className="text-sm text-gray-500">Registered Patient</p>
              </div>
            </div>
          </div>
          <nav className="space-y-4 pt-12">
            <Link 
              to="/Patient-Dashbord" 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserCircle size={20} />
              <span className="font-semibold">Dashboard</span>
            </Link>
            <Link 
              to="/BookAppointment" 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarPlus size={20} />
              <span>Book Appointment</span>
            </Link>
            <Link 
              to="/AppointmentHistory" 
              className="flex items-center space-x-2 text-blue-500 font-bold"
              onClick={() => setSidebarOpen(false)}
            >
              <FaHistory size={20} />
              <span>Appointment History</span>
            </Link>
          </nav>
        </div>
        <Link 
          to="/logout" 
          className="flex items-center space-x-2 text-red-500 hover:text-red-700"
          onClick={() => setSidebarOpen(false)}
        >
          <FaPowerOff size={20} />
          <span>Log out</span>
        </Link>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div
            className="relative p-6 rounded-lg shadow-md text-white w-full h-48 flex flex-col justify-center mb-8"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="text-2xl font-bold text-blue-500">Wellcome {patientName} </h2>
            <p className="mt-2 text-blue-500">
              Review your past and upcoming medical appointments
            </p>
          </div>

          {/* Appointment History Table */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaHistory className="mr-2 text-blue-600" />
              Your Appointments
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <th className="p-3 text-left rounded-l-lg">Patient</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Doctor</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Contact</th>
                    <th className="p-3 text-left rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-3 text-gray-700">{appointment.patientName}</td>
                      <td className="p-3 text-gray-700">{appointment.department}</td>
                      <td className="p-3 text-gray-700">{appointment.doctor}</td>
                      <td className="p-3 text-gray-700">{appointment.date}</td>
                      <td className="p-3 text-gray-700">{appointment.time}</td>
                      <td className="p-3 text-gray-700">{appointment.phone}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "Completed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {appointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No appointment history found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentHistory;