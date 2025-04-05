import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarPlus, FaHistory, FaUserCircle, FaPowerOff, FaBars, FaTimes } from "react-icons/fa";
import bgImage from "./assets/b4.jpg";

const PatientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const patientName = "Abenzer"; // Replace with dynamic patient name from your state/context

  return (
    <div className="flex h-screen bg-gray-100">
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

      {/* Sidebar - Mobile */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-1/4`}>
        <div>
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
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
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
      <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0">
        {/* Welcome Message with Background Image */}
        <div
          className="relative p-6 rounded-lg shadow-md text-white w-full h-48 md:h-60 flex flex-col justify-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-2xl font-bold text-blue-500">Welcome, {patientName}</h2>
          <p className="text-sm mt-2 text-blue-500">
            The hospital management systems provide real-time updates on patient vitals, 
            treatment progress, and appointment schedules, 
            enabling healthcare providers to deliver efficient, well-coordinated,
            and personalized care.
          </p>
        </div>

        {/* Appointment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Link 
            to="/BookAppointment" 
            className="bg-gradient-to-r from-blue-300 to-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transform transition hover:scale-105"
            onClick={() => setSidebarOpen(false)}
          >
            <FaCalendarPlus size={40} />
            <h3 className="text-lg font-semibold mt-2">Book My Appointment</h3>
            <p className="text-sm">Book Appointment</p>
          </Link>

          <Link 
            to="/AppointmentHistory" 
            className="bg-gradient-to-r from-blue-300 to-blue-500  text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transform transition hover:scale-105"
            onClick={() => setSidebarOpen(false)}
          >
            <FaHistory size={40} />
            <h3 className="text-lg font-semibold mt-2">My Appointment History</h3>
            <p className="text-sm">My Appointment</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;