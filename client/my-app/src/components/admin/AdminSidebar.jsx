import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaUserPlus,
  FaThLarge,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-gray-700"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-lg p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        <div className="overflow-y-auto">
          {/* Admin Profile Section */}
          <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 mt-6 mb-8 p-4 rounded-xl">
            <FaUserCircle className="mr-3 text-blue-600 text-4xl" />
            <div>
              <h2 className="font-bold text-gray-800 text-lg">Admin</h2>
              <p className="text-gray-600 text-sm">Administrator</p>
            </div>
          </div>

          {/* Logout Button at the top */}
          <button
            onClick={() => {
              navigate("/");
              setSidebarOpen(false);
            }}
            className="flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 mb-6 p-3 border rounded-lg w-full font-medium text-white transition-all"
          >
            <span>Log Out</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-3">
            <Link
              to="/AdminDashboard"
              className="flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <FaThLarge className="text-blue-500" size={18} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/getAllDoctors"
              className="flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd className="text-blue-500" size={18} />
              <span>Doctors</span>
            </Link>

            <Link
              to="/Departments"
              className="flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsers className="text-blue-500" size={18} />
              <span>Departments</span>
            </Link>

            <Link
              to="/Appointments"
              className="flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarCheck className="text-blue-500" size={18} />
              <span>Appointments</span>
            </Link>

            <Link
              to="/admin/doctors"
              className="flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserPlus className="text-blue-500" size={18} />
              <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden z-10 fixed inset-0  backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar; 