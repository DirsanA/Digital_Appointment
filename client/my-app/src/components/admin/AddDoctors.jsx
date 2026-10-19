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
  FaEyeSlash,
  FaEye,
  FaCamera,
} from "react-icons/fa";
import { Menu } from "@headlessui/react";
import AdminSidebar from "./AdminSidebar";

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
    photoPreview: "",
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

  const fetchDoctorData = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/doctor/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch doctor data");
      }
      const data = await response.json();
      setFormData({
        doctor_name: data.doctorfullname || "",
        email_id: data.email || "",
        password: "", // Don't pre-fill password for security
        contact: data.contact || "",
        department: data.department || "",
        experiance: data.experiance || "",
        photo: null,
        photoPreview: data.photo_url || "",
      });
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      alert("Error loading doctor data");
    }
  };

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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: file,
          photoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.doctor_name || !formData.email_id || !formData.department) {
        throw new Error("Doctor name, email, and department are required");
      }

      // For file uploads, we need to use FormData
      const formDataToSend = new FormData();
      formDataToSend.append("doctorfullname", formData.doctor_name);
      formDataToSend.append("email", formData.email_id);
      if (formData.password) {
        formDataToSend.append("pwd", formData.password);
      }
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("experiance", formData.experiance);
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const url = isEditMode
        ? `http://localhost:5000/doctor/${id}`
        : "http://localhost:5000/admin/doctors";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        // Don't set Content-Type header when using FormData
        // The browser will set it automatically with the correct boundary
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
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
              {/* Photo Upload */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {formData.photoPreview ? (
                    <img
                      src={formData.photoPreview}
                      alt="Doctor Preview"
                      className="shadow-md border-4 border-white rounded-full w-32 h-32 object-cover"
                    />
                  ) : (
                    <div className="flex justify-center items-center bg-gray-200 shadow-md border-4 border-white rounded-full w-32 h-32">
                      <FaUserCircle className="text-gray-400 text-6xl" />
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="right-0 bottom-0 absolute bg-blue-500 hover:bg-blue-600 p-2 rounded-full text-white transition-all cursor-pointer"
                  >
                    <FaCamera />
                    <input
                      id="photo-upload"
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mb-4 text-gray-500 text-sm">
                  Click on camera icon to upload photo
                </p>
              </div>

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
                    className="top-1/2 right-3 absolute focus:outline-none text-gray-500 hover:text-gray-700 -translate-y-1/2 transform"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
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
                  Experience (years):
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
