import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientRegister = () => {
  const navigate = useNavigate();

  const [name, setName] = useState(""); // Changed from full_name to name
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^09\d{8}$/.test(phone);
  const isValidPassword = (password) => password.length >= 6;

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate all fields
    if (!name || !email || !phone || !password) {
      return setError("All fields are required");
    }
    if (!isValidEmail(email)) return setError("Please enter a valid email.");
    if (!isValidPhone(phone))
      return setError("Phone must start with 09 and be 10 digits.");
    if (!isValidPassword(password))
      return setError("Password must be at least 6 characters.");

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/patient", {
        name, // Changed from full_name to match backend
        email,
        phone,
        password,
      });

      setMessage(response.data.message || "Registration successful!");
      setTimeout(() => navigate("/patient-login"), 2000);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-blue-600 px-4 min-h-screen">
      <div className="bg-white shadow-2xl p-6 md:p-8 rounded-2xl w-full max-w-md">
        <h2 className="mb-4 font-bold text-gray-800 text-2xl md:text-3xl text-center">
          Patient Registration
        </h2>

        {message && (
          <p className="bg-green-100 mb-4 p-2 rounded text-green-700 text-center">
            ✅ {message}
          </p>
        )}
        {error && (
          <p className="bg-red-100 mb-4 p-2 rounded text-red-700 text-center">
            ⚠️ {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full text-black"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full text-black"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full text-black"
              placeholder="09XXXXXXXX"
              required
              maxLength="10"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full text-black"
              placeholder="Create a password (min 6 characters)"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg w-full transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/patient-login")}
            className="focus:outline-none font-medium text-blue-500 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default PatientRegister;
