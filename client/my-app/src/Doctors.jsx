import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle, FaUserMd, FaUsers, FaCalendarCheck,
  FaThLarge, FaSignOutAlt, FaBars, FaTimes, FaSearch
} from "react-icons/fa";
import drAbreham from './assets/doc9.jpg';
import drEmily from './assets/doc8.jpg';
// Sample JSON data
const sampleData = {
  stats: {
    totalPatients: 0,
    totalDoctors: 2,
    totalAppointments: 0
  },
  doctors: [
    {
      name: "Dr. Dirsan Antehun",
      email: "dirsan@gmail.com",
      department: "Cardiology",
      contact: "0916783478",
      photo:  drAbreham,
      experience: "8 years"
    },
    {
      name: "Dr. Desu Mulat",
      email: "desu@gmail.com",
      department: "Neurology",
      contact: "0907412708",
      photo: drEmily,
      experience: "6 years"
    }
  ]
};

const Doctors = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0
  });
  const [email, setEmail] = useState("");

  useEffect(() => {
    setStats(sampleData.stats);
    setDoctors(sampleData.doctors);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredDoctors = sampleData.doctors.filter(doctor =>
      doctor.email.toLowerCase().includes(email.toLowerCase())
    );
    setDoctors(filteredDoctors);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-black">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10 flex justify-end text-black">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-black"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:right-0 md:translate-x-0 md:w-1/4`}>
        <div className="overflow-y-auto">
          <h2 className="text-lg font-bold mb-6 flex items-center p-4 text-gray-700">
            <FaUserCircle className="text-blue-500 text-4xl mr-3" /> Admin
          </h2>
          <nav className="space-y-2 text-black">
            <Link to="/AdminDashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
              <FaThLarge size={20} /> <span>Dashboard</span>
            </Link>
            <Link to="/Doctors" className="flex items-center space-x-2 p-2 bg-gray-200 rounded-md font-semibold">
              <FaUserMd size={20} /> <span>Doctors</span>
            </Link>
            <Link to="/Departments" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
              <FaUsers size={20} /> <span>Departments</span>
            </Link>
            <Link to="/Appointments" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
              <FaCalendarCheck size={20} /> <span>Appointments</span>
            </Link>
            <Link to="/AddDoctors" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
              <FaUserMd size={20} /> <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link to="/logout" className="flex items-center space-x-2 p-2 text-red-500 hover:bg-red-50 rounded-md">
          <FaSignOutAlt size={20} /> <span>Log out</span>
        </Link>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaUsers size={32} className="text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaUserMd size={32} className="text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Doctors</p>
                <p className="text-2xl font-bold">{stats.totalDoctors}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaCalendarCheck size={32} className="text-purple-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-bold">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Doctor's email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 flex items-center"
              >
                <FaSearch className="mr-2" /> Search
              </button>
            </form>
          </div>

          {/* Doctor Table */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Photo</th>
                    <th className="border p-2">Doctor Name</th>
                    <th className="border p-2">Password</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Department</th>
                    <th className="border p-2">Contact</th>
                    <th className="border p-2">Experience</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor, index) => (
                    <tr key={index} className="text-center border-t">
                      <td className="border p-2">
                        <img
                          src={doctor.photo || "https://via.placeholder.com/50"}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-full mx-auto"
                        />
                      </td>
                      <td className="border p-2">{doctor.name}</td>
                      <td className="border p-2">••••••••</td>
                      <td className="border p-2">{doctor.email}</td>
                      <td className="border p-2">{doctor.department}</td>
                      <td className="border p-2">{doctor.contact}</td>
                      <td className="border p-2">{doctor.experience}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Doctors;
