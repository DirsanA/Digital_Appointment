import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarPlus,
  FaHistory,
  FaUserCircle,
  FaPowerOff,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import bgImage from "./assets/b4.jpg";

const PatientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const patientName = "Abenzer"; // Replace with dynamic patient name from your state/context

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Mobile Header - Right-aligned hamburger */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-gray-700"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar - Right Side */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        <div>
          <div className="flex items-center mt-12 md:mt-0 mb-6 p-4">
            <div className="flex items-center">
              <FaUserCircle className="mr-3 text-blue-500 text-4xl" />
              <div>
                <h1 className="font-bold text-blue-600 text-xl">
                  {patientName}
                </h1>
                <p className="text-gray-500 text-sm">Registered Patient</p>
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
          className="md:hidden z-10 fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:mr-0 p-6">
        {/* Welcome Message with Background Image */}
        <div
          className="relative flex flex-col justify-center shadow-md p-6 rounded-lg w-full h-48 md:h-60 text-white"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="font-bold text-blue-500 text-2xl">
            Welcome, {patientName}
          </h2>
          <p className="mt-2 text-blue-500 text-sm">
            The hospital management systems provide real-time updates on patient
            vitals, treatment progress, and appointment schedules, enabling
            healthcare providers to deliver efficient, well-coordinated, and
            personalized care.
          </p>
        </div>

        {/* Appointment Cards */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mt-6">
          <Link
            to="/BookAppointment"
            className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-300 to-blue-500 shadow-md p-6 rounded-lg text-white hover:scale-105 transition transform"
            onClick={() => setSidebarOpen(false)}
          >
            <FaCalendarPlus size={40} />
            <h3 className="mt-2 font-semibold text-lg">Book My Appointment</h3>
            <p className="text-sm">Book Appointment</p>
          </Link>

          <Link
            to="/AppointmentHistory"
            className="flex flex-col justify-center items-center bg-gradient-to-r from-green-300 to-green-500 shadow-md p-6 rounded-lg text-white hover:scale-105 transition transform"
            onClick={() => setSidebarOpen(false)}
          >
            <FaHistory size={40} />
            <h3 className="mt-2 font-semibold text-lg">
              My Appointment History
            </h3>
            <p className="text-sm">My Appointment</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
