import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaCalendarPlus,
  FaHistory,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const PatientSidebar = ({ sidebarOpen, setSidebarOpen, patientData, handleLogout }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-between items-center bg-white shadow-md p-4">
        <div className="flex items-center">
          <FaUserCircle className="mr-3 text-blue-500 text-2xl" />
          <h1 className="font-bold text-blue-600 text-lg">
            {patientData.full_name}
          </h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-gray-700"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-lg flex flex-col z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        {/* Fixed Profile Section */}
        <div className="p-5 mt-16 md:mt-6">
          <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
            <FaUserCircle className="mr-3 text-blue-600 text-4xl" />
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                {patientData.full_name}
              </h2>
              <p className="text-gray-600 text-sm">Registered Patient</p>
            </div>
          </div>

          {/* Fixed Logout Button */}
          <button
            onClick={handleLogout}
            className="flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 mt-6 p-3 border rounded-lg w-full font-medium text-white transition-all"
          >
            <span>Log Out</span>
          </button>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <nav className="space-y-3">
            <Link
              to="/Patient-Dashbord"
              className={`flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all ${
                location.pathname === "/Patient-Dashbord" ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FaThLarge className="text-blue-500" size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/BookAppointment"
              className={`flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all ${
                location.pathname === "/BookAppointment" ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarPlus className="text-blue-500" size={18} />
              <span>Book Appointment</span>
            </Link>
            <Link
              to="/AppointmentHistory"
              className={`flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all ${
                location.pathname === "/AppointmentHistory" ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FaHistory className="text-blue-500" size={18} />
              <span>Appointment History</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden z-10 fixed inset-0  backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default PatientSidebar; 