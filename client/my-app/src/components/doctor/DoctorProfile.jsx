import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function DoctorProfile() {
  const [doctor, setDoctor] = useState({
    id: "",
    doctorfullname: "",
    email: "",
    contact: "",
    department: "",
    experience: "",
    role: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
    const [showPasswordd, setShowPasswordd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const doctorId = localStorage.getItem("doctorId");
        if (!doctorId) {
          throw new Error("Doctor ID not found");
        }

        const response = await axios.get(
          `http://localhost:5000/admin/doctors/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success && response.data.doctor) {
          const doctorData = response.data.doctor;
          setDoctor({
            id: doctorData._id || doctorData.id,
            doctorfullname: doctorData.doctorfullname || "",
            email: doctorData.email || "",
            contact: doctorData.contact || "",
            department: doctorData.department || "",
            experience: doctorData.experiance || doctorData.experience || "0", // Handle both spellings
            role: doctorData.role || "doctor",
          });
        } else {
          throw new Error(
            response.data.message || "Failed to fetch doctor data"
          );
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        setError(
          error.response?.data?.message || "Failed to load doctor profile"
        );
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("doctorId");
          navigate("/login");
        }
      }
    };

    fetchDoctorProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/admin/doctors/${doctor.id}`,
        {
          doctorfullname: doctor.doctorfullname,
          email: doctor.email,
          contact: doctor.contact,
          department: doctor.department,
          experiance: doctor.experience,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setEditMode(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("doctorId");
        navigate("/login");
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const doctorId = localStorage.getItem("doctorId"); // Get doctor ID from storage

      if (!doctorId) {
        throw new Error("Doctor ID not found");
      }

      const response = await axios.post(
        "http://localhost:5000/doctor/change-password",
        {
          currentPassword,
          newPassword,
          id: doctorId, // Include doctor ID in request
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.data.message || "Password change failed");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(
        error.response?.data?.message || "Error changing password"
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("doctorId");
        navigate("/login");
      }
    }
  };

  return (
    <div className="bg-gray-50 px-4 py-8 min-h-screen">
      <div className="bg-white shadow-md mx-auto rounded-xl max-w-4xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="font-bold text-2xl">Doctor Profile</h1>
          <p className="opacity-90">Manage your professional information</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 mb-4 p-3 rounded text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 mb-4 p-3 rounded text-green-700">
              {successMessage}
            </div>
          )}

          <div className="flex md:flex-row flex-col gap-8">
            {/* Profile Information */}
            <div className="flex-1">
              <h2 className="mb-4 font-semibold text-gray-800 text-xl">
                Personal Information
              </h2>

              {!editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-500 text-sm">
                      Full Name
                    </label>
                    <p className="mt-1 text-gray-900">
                      {doctor.doctorfullname}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-500 text-sm">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900">{doctor.email}</p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-500 text-sm">
                      Contact
                    </label>
                    <p className="mt-1 text-gray-900">{doctor.contact}</p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-500 text-sm">
                      Department
                    </label>
                    <p className="mt-1 text-gray-900">{doctor.department}</p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-500 text-sm">
                      Experience
                    </label>
                    <p className="mt-1 text-gray-900">
                      {doctor.experience} years
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-500 text-sm">
                      Role
                    </label>
                    <p className="mt-1 text-gray-900">{doctor.role}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium text-gray-700 text-sm">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="doctorfullname"
                        value={doctor.doctorfullname}
                        onChange={handleInputChange}
                        className="block shadow-sm mt-1 border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 text-sm">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={doctor.email}
                        onChange={handleInputChange}
                        className="block shadow-sm mt-1 border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 text-sm">
                        Contact
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={doctor.contact}
                        onChange={handleInputChange}
                        className="block shadow-sm mt-1 border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 text-sm">
                        Department
                      </label>
                      <select
                        name="department"
                        value={doctor.department}
                        onChange={handleInputChange}
                        className="block shadow-sm mt-1 border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                        required
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Dermatology">Dermatology</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 text-sm">
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={doctor.experience}
                        onChange={handleInputChange}
                        className="block shadow-sm mt-1 border-gray-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-800 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Change Password */}
            <div className="flex-1 pt-4 md:pt-0 md:pl-6 md:border-t">
              <h2 className="mb-4 font-semibold text-gray-800 text-xl">
                Change Password
              </h2>
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 p-4 border border-black rounded-md"
              >
                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Current Password
                  </label>
                  <div className="relative">
                  <input
                     type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block shadow-sm mt-1 border border-black focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-black"
                    required
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
                  <label className="block font-medium text-gray-700 text-sm">
                    New Password
                  </label>
                  <div className="relative">
                  <input
                     type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block shadow-sm mt-1 border border-black focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-black"
                    required
                    minLength="6"
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
                  <label className="block font-medium text-gray-700 text-sm">
                    Confirm New Password
                  </label>
                   <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block shadow-sm mt-1 border border-black focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-black"
                    required
                    minLength="6"
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
                {passwordError && (
                  <div className="text-red-500 text-sm">{passwordError}</div>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
