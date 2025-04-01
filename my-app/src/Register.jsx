import { useState } from "react";

const Register = () => {
  const [role, setRole] = useState(""); // Track selected role
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    specialization: "",
    experience: "",
    hospital: "",
    consultationFee: "",
    medicalHistory: "",
    address: "",
    emergencyContact: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h2 className="mb-4 font-bold text-2xl text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            required
          />

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            required
          />

          {/* Gender */}
          <select
            name="gender"
            onChange={handleChange}
            className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Date of Birth */}
          <input
            type="date"
            name="dateOfBirth"
            onChange={handleChange}
            className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            required
          />

          {/* Role Selection */}
          <select
            name="role"
            onChange={(e) => setRole(e.target.value)}
            className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            required
          >
            <option value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>

          {/* Patient-Specific Fields */}
          {role === "patient" && (
            <>
              <input
                type="text"
                name="medicalHistory"
                placeholder="Medical History"
                onChange={handleChange}
                className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
              />
              <input
                type="text"
                name="emergencyContact"
                placeholder="Emergency Contact"
                onChange={handleChange}
                className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
              />
            </>
          )}

          {/* Doctor-Specific Fields */}
          {role === "doctor" && (
            <>
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                onChange={handleChange}
                className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
                required
              />
              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                onChange={handleChange}
                className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
                required
              />
              <input
                type="text"
                name="hospital"
                placeholder="Hospital Name"
                onChange={handleChange}
                className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
                required
              />
              <input
                type="number"
                name="consultationFee"
                placeholder="Consultation Fee"
                onChange={handleChange}
                className="p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
                required
              />
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 p-3 rounded w-full font-semibold text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
