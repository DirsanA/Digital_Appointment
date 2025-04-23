import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientRegister = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^09\d{8}$/.test(phone);
  const isValidPassword = (password) => password.length >= 6;

  function handleSubmit(e) {
    e.preventDefault();

    // Reset messages
    setMessage(null);
    setError(null);

    // Validation before sending request
    if (!isValidEmail(email)) {
      return setError("Please enter a valid email address.");
    }

    if (!isValidPhone(phone)) {
      return setError("Phone number must start with 09 and be 10 digits.");
    }

    if (!isValidPassword(password)) {
      return setError("Password must be at least 6 characters long.");
    }

    setIsLoading(true);

    // Send request
    axios
      .post("http://localhost:5000/patient", {
        name,
        email,
        phone,
        password,
      })
      .then((response) => {
        console.log("✅ Response:", response.data);
        setMessage(response.data.message || "Patient registered successfully!");
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");

        // Redirect after 2 seconds
        setTimeout(() => navigate("/patient-login"), 2000);
      })
      .catch((err) => {
        console.error("❌ Error:", err.response?.data);
        setError(
          err.response?.data?.message || "An error occurred while registering."
        );
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-blue-600 px-4 min-h-screen">
      <div className="bg-white shadow-2xl p-6 md:p-8 rounded-2xl w-full max-w-md">
        <h2 className="mb-4 font-bold text-gray-800 text-2xl md:text-3xl text-center">
          Patient Registration
        </h2>

        {/* Feedback Messages */}
        {message && (
          <p className="bg-green-100 mb-4 p-2 rounded-md text-green-700 text-sm text-center">
            ✅ {message}
          </p>
        )}
        {error && (
          <p className="bg-red-100 mb-4 p-2 rounded-md text-red-700 text-sm text-center">
            ⚠️ {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 0943599259"
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 hover:bg-blue-600 shadow-lg p-3 rounded-lg w-full font-semibold text-white transition duration-300 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-3 text-gray-600 text-center">
          Already registered?{" "}
          <button
            className="font-semibold text-blue-500 hover:underline"
            onClick={() => navigate("/patient-login")}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default PatientRegister;
