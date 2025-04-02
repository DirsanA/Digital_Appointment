import { Link } from "react-router-dom";
import { FaCalendarPlus, FaHistory, FaUserCircle, FaPowerOff } from "react-icons/fa";
import bgImage from "./assets/b4.jpg";

const AppointmentHistory = () => {
  const appointments = [
    {
      doctor: "Dr. Desu",
      contact: "090742",
      date: "April 5, 2025",
      time: "10:00 AM",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-md p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-6 p-4">
            <img 
              src="./assets/hospital10.jpg" 
              alt="Hospital Logo" 
              className="h-20 w-20 object-contain mr-3" 
            />
            <h1 className="text-xl font-bold text-red-600"></h1>
          </div>
          <nav className="space-y-4 pt-12">
            <Link to="/Patient-Dashbord" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <FaUserCircle size={20} />
              <span className="font-semibold">Dashboard</span>
            </Link>
            <Link to="/BookAppointment" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <FaCalendarPlus size={20} />
              <span>Book Appointment</span>
            </Link>
            <Link to="/AppointmentHistory" className="flex items-center space-x-2 text-blue-500 font-bold">
              <FaHistory size={20} />
              <span>Appointment History</span>
            </Link>
          </nav>
        </div>
        <Link to="/logout" className="flex items-center space-x-2 text-red-500 hover:text-red-700">
          <FaPowerOff size={20} />
          <span>Log out</span>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center">
        {/* Welcome Section */}
        <div
          className="relative p-6 rounded-lg shadow-md text-white w-full h-48 flex flex-col justify-center mb-8"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-2xl font-bold text-blue-500">Well come to Appointment History</h2>
          <p className="mt-2 text-blue-500">
            Review your past and upcoming appointments
          </p>
        </div>

        {/* Appointment History Table */}
        <div className="mt-6 bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaHistory className="mr-2 text-blue-600" />
            Appointment Records
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <th className="p-3 text-left rounded-l-lg">Doctor Name</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left rounded-r-lg">Time</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-3 text-gray-700">{appointment.doctor}</td>
                    <td className="p-3 text-gray-700">{appointment.contact}</td>
                    <td className="p-3 text-gray-700">{appointment.date}</td>
                    <td className="p-3 text-gray-700">{appointment.time}</td>
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
      </main>
    </div>
  );
};

export default AppointmentHistory;