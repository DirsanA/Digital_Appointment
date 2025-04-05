import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaUserPlus, FaUserMd, FaUsers, FaCalendarCheck, FaThLarge, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const AddDoctors = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    department: "",
    experience: "",
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setStats({
          totalPatients: data.totalPatients || 0,
          totalDoctors: data.totalDoctors || 0,
          totalAppointments: data.totalAppointments || 0
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const response = await fetch("/api/doctors", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Doctor added successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          contact: "",
          department: "",
          experience: "",
          photo: null,
        });

        const statsResponse = await fetch("/api/stats");
        const statsData = await statsResponse.json();
        setStats({
          totalPatients: statsData.totalPatients || 0,
          totalDoctors: statsData.totalDoctors || 0,
          totalAppointments: statsData.totalAppointments || 0,
        });
      } else {
        throw new Error(result.message || "Failed to add doctor");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-black">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10 flex justify-end">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:right-0 md:translate-x-0 md:w-1/4`}>
        <div className="overflow-y-auto">
          <h2 className="text-lg font-bold mb-6 flex items-center p-4">
            <FaUserCircle className="text-blue-500 text-4xl mr-3" /> Admin
          </h2>
          <nav className="space-y-2">
            <Link to="/AdminDashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md" onClick={() => setSidebarOpen(false)}>
              <FaThLarge size={20} /><span>Dashboard</span>
            </Link>
            <Link to="/Doctors" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md" onClick={() => setSidebarOpen(false)}>
              <FaUserMd size={20} /><span>Doctors</span>
            </Link>
            <Link to="/Departments" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md" onClick={() => setSidebarOpen(false)}>
              <FaUsers size={20} /><span>Departments</span>
            </Link>
            <Link to="/Appointments" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md" onClick={() => setSidebarOpen(false)}>
              <FaCalendarCheck size={20} /><span>Appointments</span>
            </Link>
            <Link to="/AddDoctors" className="flex items-center space-x-2 p-2 bg-gray-200 rounded-md font-semibold" onClick={() => setSidebarOpen(false)}>
              <FaUserPlus size={20} /><span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link to="/Logout" className="flex items-center space-x-2 p-2 text-red-500 hover:bg-red-50 rounded-md" onClick={() => setSidebarOpen(false)}>
          <FaSignOutAlt size={20} /><span>Log out</span>
        </Link>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaUsers size={32} className="text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                {statsLoading ? <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div> : <p className="text-2xl font-bold">{stats.totalPatients}</p>}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaUserMd size={32} className="text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Doctors</p>
                {statsLoading ? <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div> : <p className="text-2xl font-bold">{stats.totalDoctors}</p>}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaCalendarCheck size={32} className="text-purple-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                {statsLoading ? <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div> : <p className="text-2xl font-bold">{stats.totalAppointments}</p>}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <FaUserPlus className="mr-2 text-blue-600" /> Add New Doctor
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact:</label>
                <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                <select name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years):</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-blue-400" disabled={loading}>
                {loading ? "Adding..." : "Add Doctor"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddDoctors;
