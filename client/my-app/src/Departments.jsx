import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaUsers,
  FaThLarge,
  FaUserMd,
  FaCalendarCheck,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaBuilding,
  FaUserNurse,
  FaStethoscope,
} from "react-icons/fa";

const Departments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    desktopCount: 16,
  });
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch("http://localhost:5000/department");
        const statsData = await statsResponse.json();
        const deptResponse = await fetch("http://localhost:5000/department");
        const deptData = await deptResponse.json();

        setStats((prev) => ({ ...prev, ...statsData }));
        setDepartments(deptData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/department`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error searching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden text-black">
      {/* Mobile Header */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-black"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar - Left Side */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        <div className="overflow-y-auto">
          <h2 className="flex items-center mb-6 p-4 font-bold text-gray-700 text-lg">
            <FaUserCircle className="mr-3 text-blue-500 text-4xl" /> Admin
          </h2>
          <nav className="space-y-2">
            <Link
              to="/AdminDashboard"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-black"
              onClick={() => setSidebarOpen(false)}
            >
              <FaThLarge size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/Doctors"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-black"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd size={20} />
              <span>Doctors</span>
            </Link>
            <Link
              to="/Departments"
              className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md font-semibold"
              onClick={() => setSidebarOpen(false)}
            >
              <FaBuilding size={20} />
              <span>Departments</span>
            </Link>
            <Link
              to="/Appointments"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-black"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarCheck size={20} />
              <span>Appointments</span>
            </Link>
            <Link
              to="/AddDoctors"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-black"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd size={20} />
              <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link
          to="/logout"
          className="flex items-center space-x-2 hover:bg-red-50 p-2 rounded-md text-red-500"
          onClick={() => setSidebarOpen(false)}
        >
          <FaSignOutAlt size={20} />
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
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          {/* Stats Section with Icons */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-8">
            <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
              <FaUsers size={32} className="mr-4 text-blue-500" />
              <div>
                <p className="text-gray-500 text-sm">Total Patients</p>
                <p className="font-bold text-2xl">{stats.totalPatients}</p>
              </div>
            </div>
            <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
              <FaUserMd size={32} className="mr-4 text-green-500" />
              <div>
                <p className="text-gray-500 text-sm">Total Doctors</p>
                <p className="font-bold text-2xl">{stats.totalDoctors}</p>
              </div>
            </div>
            <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
              <FaCalendarCheck size={32} className="mr-4 text-purple-500" />
              <div>
                <p className="text-gray-500 text-sm">Total Appointments</p>
                <p className="font-bold text-2xl">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white shadow-md mb-6 p-4 rounded-lg">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter Department ID"
                className="flex-1 px-4 py-2 border border-gray-300 focus:border-blue-500 rounded-l-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="flex items-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg text-white"
              >
                <FaSearch className="mr-2" /> Search
              </button>
            </form>
          </div>

          {/* Departments Table */}
          <div className="bg-white shadow-md p-4 rounded-lg overflow-x-auto">
            <table className="border w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Department</th>
                  <th className="p-2 border">Number Of Doctors</th>
                  <th className="p-2 border">Department ID</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <tr key={dept.id} className="text-center">
                      <td className="p-2 border">{dept.name}</td>
                      <td className="p-2 border">{dept.doctorCount}</td>
                      <td className="p-2 border">{dept.id}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="3" className="p-4 text-gray-500">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Departments;
