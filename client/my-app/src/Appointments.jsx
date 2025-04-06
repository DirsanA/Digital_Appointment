import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle,FaCalendarCheck, FaUserMd, FaUsers, FaThLarge, FaSignOutAlt, FaBars, FaTimes, FaSearch } from "react-icons/fa";

const Appointments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0
  });
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch statistics
        const statsRes = await fetch("/api/stats");
        const statsData = await statsRes.json();
        
        // Fetch appointments
        const apptRes = await fetch("/api/appointments");
        const apptData = await apptRes.json();
        
        setStats(statsData);
        setAppointments(apptData);
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
      const res = await fetch(`/api/appointments?department=${departmentId}`);
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error searching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10 flex justify-end">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar - Left Side */}
       <aside className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:right-0 md:translate-x-0 md:w-1/4`}>
        <div className="overflow-y-auto">
          <h2 className="text-lg font-bold mb-6 flex items-center p-4 text-gray-700">
               <FaUserCircle className="text-blue-500 text-4xl mr-3" /> Admin
               </h2>
          <nav className="space-y-2">
            <Link 
              to="/AdminDashboard" 
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-200 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaThLarge size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/Doctors" 
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-200 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd size={20} />
              <span>Doctors</span>
            </Link>
            <Link 
              to="/Departments" 
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-200 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsers size={20} />
              <span>Departments</span>
            </Link>
            <Link 
              to="/Appointments" 
              className="flex items-center space-x-2 p-2 text-gray-700  bg-gray-200 rounded-md font-semibold"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarCheck size={20} />
              <span>Appointments</span>
            </Link>
            <Link 
              to="/AddDoctors" 
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-200 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd size={20} />
              <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link 
          to="/logout" 
          className="flex items-center space-x-2 p-2 text-red-500 hover:bg-red-50 rounded-md"
          onClick={() => setSidebarOpen(false)}
        >
          <FaSignOutAlt size={20} />
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
          {/* Stats Section with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaUsers size={32} className="text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-black">{stats.totalPatients}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaUserMd size={32} className="text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Doctors</p>
                <p className="text-2xl font-bold text-black">{stats.totalDoctors}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaCalendarCheck size={32} className="text-purple-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-bold text-black">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                placeholder="Enter patient email ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 flex items-center"
                disabled={loading}
              >
                <FaSearch className="mr-2" /> {loading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {/* Appointments Table */}
          <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border text-black">Full Name</th>
                  <th className="p-2 border text-black">Email</th>
                  <th className="p-2 border text-black">Contact</th>
                  <th className="p-2 border text-black">Doctor Name</th>
                  <th className="p-2 border text-black">Department</th>
                  <th className="p-2 border text-black">Appointment Date</th>
                  <th className="p-2 border text-black">Appointment Time</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appt, index) => (
                    <tr key={index} className="text-center hover:bg-gray-50">
                      <td className="p-2 border">{appt.patientName || "Desu"}</td>
                      <td className="p-2 border">{appt.email || "desu@gmail.com"}</td>
                      <td className="p-2 border">{appt.contact || "97486"}</td>
                      <td className="p-2 border">{appt.doctor || "Dirsan"}</td>
                      <td className="p-2 border">{appt.fees || "500"}</td>
                      <td className="p-2 border">{appt.date || "12-12-2017"}</td>
                      <td className="p-2 border">{appt.time || "10:30am"}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="7" className="p-4 text-gray-500">
                      No appointments found
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

export default Appointments;