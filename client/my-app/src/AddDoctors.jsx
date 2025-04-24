import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaUserCircle, FaUserPlus, FaUserMd, FaUsers, FaCalendarCheck, FaThLarge, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const AddDoctors = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctor_name: "",
    email_id: "",
    password: "",
    contact: "",
    department: "",
    experiance: "",
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
    if (id) {
      setIsEditMode(true);
      fetchDoctorData(id);
    }
    fetchStats();
  }, [id]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/doctor`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch doctor data');
      }
      
      const data = await response.json();
      setFormData({
        doctor_name: data.doctor_name || "",
        email_id: data.email_id || "",
        password: data.password || "",
        contact: data.contact || "",
        department: data.department || "",
        experiance: data.experiance || "",
        photo: data.photo || null,
      });
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/doctor");
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'experiance' ? parseInt(value) || 0 : value
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
      // Validate required fields
      if (!formData.doctor_name || !formData.email_id || !formData.department) {
        throw new Error('Doctor name, email, and department are required');
      }

      const data = new FormData();
      data.append('doctor_name', formData.doctor_name);
      data.append('email_id', formData.email_id);
      data.append('password', formData.password || '');
      data.append('contact', formData.contact || '');
      data.append('department', formData.department);
      data.append('experiance', formData.experiance);
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      const url = isEditMode 
        ? `http://localhost:5000/doctor/${id}`
        : "http://localhost:5000/doctor";
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      const result = await response.json();
      alert(isEditMode ? "Doctor updated successfully!" : "Doctor added successfully!");
      navigate("/Doctors");
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error: ${error.message}`);
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
              <FaUserPlus className="mr-2 text-blue-600" /> 
              {isEditMode ? "Edit Doctor" : "Add New Doctor"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name:</label>
                <input 
                  type="text" 
                  name="doctor_name" 
                  value={formData.doctor_name} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID:</label>
                <input 
                  type="email" 
                  name="email_id" 
                  value={formData.email_id} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required={!isEditMode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact:</label>
                <input 
                  type="tel" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Departments</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experiance (years):</label>
                <input 
                  type="number" 
                  name="experiance" 
                  value={formData.experiance} 
                  onChange={handleChange} 
                  min="0"
                  max="50"
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  required={!isEditMode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-blue-400" 
                disabled={loading}
              >
                {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Doctor" : "Add Doctor")}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddDoctors;