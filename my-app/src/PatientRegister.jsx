import { useState } from "react";

const PatientRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-blue-600 px-4 min-h-screen">
      <div className="bg-white shadow-2xl p-6 md:p-8 rounded-2xl w-full max-w-md">
        {/* Title */}
        <h2 className="mb-4 font-bold text-gray-800 text-2xl md:text-3xl text-center">
          Patient Registration
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              onChange={handleChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 shadow-lg p-3 rounded-lg w-full font-semibold text-white transition duration-300"
          >
            Register
          </button>
        </form>

        {/* Already have an account? */}
        <p className="mt-3 text-gray-600 text-center">
          Already registered?{" "}
          <a href="#" className="font-semibold text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default PatientRegister;
