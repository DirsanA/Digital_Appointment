import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaUserPlus,
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaThLarge,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

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
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchDoctorData(id);
    }
    fetchStats();
  }, [id]);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/doctor");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats({
        totalPatients: data.totalPatients || 0,
        totalDoctors: data.totalDoctors || 0,
        totalAppointments: data.totalAppointments || 0,
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
      [name]: name === "experiance" ? parseInt(value) || 0 : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.doctor_name || !formData.email_id || !formData.department) {
        throw new Error("Doctor name, email, and department are required");
      }

      const requestData = {
        doctorfullname: formData.doctor_name,
        email: formData.email_id,
        pwd: formData.password || "",
        contact: formData.contact || "",
        department: formData.department,
        experiance: formData.experiance,
      };

      const url = isEditMode
        ? `http://localhost:5000/doctor/${id}`
        : "http://localhost:5000/admin/doctors";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }

      const result = await response.json();
      alert(
        isEditMode
          ? "Doctor updated successfully!"
          : "Doctor added successfully!"
      );
      navigate("/admin/getAllDoctors");
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden text-black">
      {/* Mobile Header */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        <div className="overflow-y-auto">
          <h2 className="flex items-center mb-6 p-4 font-bold text-lg">
            <FaUserCircle className="mr-3 text-blue-500 text-4xl" /> Admin
          </h2>
          <nav className="space-y-2">
            <Link
              to="/AdminDashboard"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaThLarge size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/getAllDoctors"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd size={20} />
              <span>Doctors</span>
            </Link>
            <Link
              to="/Departments"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsers size={20} />
              <span>Departments</span>
            </Link>
            <Link
              to="/Appointments"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarCheck size={20} />
              <span>Appointments</span>
            </Link>
            <Link
              to="/admin/doctors"
              className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md font-semibold"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserPlus size={20} />
              <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link
          to="/Logout"
          className="flex items-center space-x-2 hover:bg-red-50 p-2 rounded-md text-red-500"
          onClick={() => setSidebarOpen(false)}
        >
          <FaSignOutAlt size={20} />
          <span>Log out</span>
        </Link>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden z-10 fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {/* Form */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="flex items-center mb-6 font-semibold text-xl">
              <FaUserPlus className="mr-2 text-blue-600" />
              {isEditMode ? "Edit Doctor" : "Add New Doctor"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Doctor Name:
                </label>
                <input
                  type="text"
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Email ID:
                </label>
                <input
                  type="email"
                  name="email_id"
                  value={formData.email_id}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditMode}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Contact:
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Department:
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                >
                  <option value="">Select Departments</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Experiance (years):
                </label>
                <input
                  type="number"
                  name="experiance"
                  value={formData.experiance}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 shadow-md py-3 rounded-lg w-full font-semibold text-white transition-all"
                disabled={loading}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                  ? "Update Doctor"
                  : "Add Doctor"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddDoctors;
// comments