import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaUserPlus, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const PatientRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
        name,
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
    <div className="flex justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-50 p-4 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="top-6 left-6 absolute flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium">Back to Home</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <div className="flex justify-center items-center bg-white/20 mx-auto mb-4 rounded-full w-20 h-20">
              <FaUserPlus className="text-white text-3xl" />
            </div>
            <h1 className="font-bold text-white text-2xl">Create Account</h1>
            <p className="mt-1 text-indigo-100">Join our healthcare platform</p>
          </div>

          {/* Registration Form */}
          <div className="p-8">
            {message && (
              <div className="bg-green-50 mb-6 px-4 py-3 border border-green-200 rounded-lg text-green-700">
                ✅ {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 mb-6 px-4 py-3 border border-red-200 rounded-lg text-red-700">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                  placeholder="Enter Your Full Name"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                  placeholder="0912345678"
                  required
                  maxLength="10"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
                <p className="mt-1 text-gray-500 text-xs">
                  Must be at least 6 characters
                </p>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all ${
                  isLoading ? "opacity-75" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex justify-center items-center">
                    <svg
                      className="mr-3 -ml-1 w-5 h-5 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Register Now"
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-5 border-gray-200 border-t">
              <p className="text-gray-600 text-sm text-center">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/patient-login")}
                  className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-gray-500 text-sm text-center">
          <p>
            © {new Date().getFullYear()} Healthcare System. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientRegister;
