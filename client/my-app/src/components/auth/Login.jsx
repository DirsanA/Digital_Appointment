import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaArrowLeft, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const Handler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      const { token, role, patientId, doctorId } = res.data;

      if (token && role) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("loginTimestamp", new Date().getTime().toString());

        if (role === "patient" && patientId) {
          localStorage.setItem("patientId", patientId);
        } else if (role === "doctor" && doctorId) {
          localStorage.setItem("doctorId", doctorId);
        }

        const redirectPath =
          {
            admin: "/AdminDashboard",
            doctor: "/doctor-landingPage",
            patient: "/Patient-Dashbord",
          }[role] || "/dashboard";

        navigate(redirectPath);
      }
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || "Server error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-50 p-4 min-h-screen">
      {/* Back to Home Button */}
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
              <FaUser className="text-white text-3xl" />
            </div>
            <h1 className="font-bold text-white text-2xl">Welcome Back</h1>
            <p className="mt-1 text-indigo-100">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={Handler} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="px-4 py-3 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="px-4 py-3 pr-12 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="top-1/2 right-3 absolute text-gray-500 hover:text-indigo-600 transition-colors -translate-y-1/2 transform"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800 text-sm hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg px-4 py-3 rounded-lg w-full font-medium text-white transition-all"
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
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="border-gray-300 border-t w-full"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/patient-register")}
                className="bg-white hover:bg-gray-50 mt-6 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg w-full font-medium text-gray-700 transition-colors"
              >
                Create new account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-gray-500 text-sm text-center">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
