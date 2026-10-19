import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaKey,
  FaClinicMedical,
  FaShieldAlt,
  FaMobileAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const inputRef = useRef([]);

  const Handler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { token, role, patientId, doctorId, needsVerification } = res.data;

      if (needsVerification) {
        setOtpEmail(email);
        setShowOtpModal(true);
        setIsLoading(false);
        return;
      }

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
      const errorMessage = err.response?.data?.message || "Server error";
      setMessage({ type: "error", text: errorMessage });

      if (err.response?.data?.needsVerification) {
        setOtpEmail(err.response.data.email);
        setShowOtpModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsOtpLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/patient/verify-otp",
        {
          email: otpEmail,
          otp: otp,
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Email verified successfully! Please login again.",
        });
        setShowOtpModal(false);
        setOtp("");
        setEmail(otpEmail);
        setPassword("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/patient/resend-otp",
        { email: otpEmail }
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "New OTP sent to your email!" });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  // Forgot Password Functions
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        "http://localhost:5000/forgot-password",
        { email }
      );

      if (response.data.success) {
        setOtpEmail(email);
        setForgotPasswordStep(2);
        setMessage({ type: "success", text: "OTP sent to your email!" });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordOtp = async (e) => {
    e.preventDefault();
    setIsOtpLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        "http://localhost:5000/verify-forgot-password-otp",
        {
          email: otpEmail,
          otp: otp,
        }
      );

      if (response.data.success) {
        setForgotPasswordStep(3);
        setMessage({
          type: "success",
          text: "OTP verified! Please set your new password.",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords don't match!" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/reset-password",
        {
          email: otpEmail,
          otp: otp,
          newPassword: newPassword,
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Password reset successfully! Please login with your new password.",
        });
        setForgotPasswordMode(false);
        setForgotPasswordStep(1);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password reset failed";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendForgotPasswordOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/resend-forgot-password-otp",
        { email: otpEmail }
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "New OTP sent to your email!" });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 min-h-screen">
      {/* Background Elements */}
      <div className="top-0 left-0 z-0 absolute w-full h-full overflow-hidden">
        <div className="-top-20 -left-20 absolute bg-blue-200 opacity-50 blur-xl rounded-full w-72 h-72"></div>
        <div className="top-1/3 -right-20 absolute bg-purple-200 opacity-50 blur-xl rounded-full w-64 h-64"></div>
        <div className="bottom-0 left-1/4 absolute bg-indigo-200 opacity-50 blur-xl rounded-full w-80 h-80"></div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="top-6 left-6 z-50 fixed flex items-center gap-2 bg-white/80 shadow-sm backdrop-blur-sm px-4 py-2 rounded-full text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium">Back to Home</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white shadow-2xl rounded-2xl w-full max-w-4xl overflow-hidden"
      >
        <div className="md:flex">
          {/* Left Side - Illustration */}
          <div className="hidden md:block bg-gradient-to-br from-indigo-600 to-purple-600 p-8 md:w-2/5 text-white">
            <div className="flex flex-col justify-center items-center h-full">
              <div className="mb-8">
                <div className="flex justify-center items-center bg-white/20 mb-6 p-4 rounded-full w-20 h-20">
                  <FaClinicMedical className="text-4xl" />
                </div>
                <h1 className="mb-2 font-bold text-3xl">MediCare+</h1>
                <p className="opacity-90">Your Health, Our Priority</p>
              </div>

              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaShieldAlt className="text-lg" />
                  </div>
                  <p className="text-sm">Secure & HIPAA Compliant</p>
                </div>

                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaMobileAlt className="text-lg" />
                  </div>
                  <p className="text-sm">24/7 Access to Your Health Data</p>
                </div>

                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaUser className="text-lg" />
                  </div>
                  <p className="text-sm">Personalized Patient Experience</p>
                </div>
              </div>

              <div className="opacity-80 mt-12 text-center">
                <p className="text-sm">
                  Trusted by 500+ healthcare professionals
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 w-full md:w-3/5">
            <div className="mb-8 text-center">
              <div className="inline-flex justify-center items-center bg-indigo-100 mb-4 p-3 rounded-full">
                {forgotPasswordMode ? (
                  <FaKey className="text-indigo-600 text-2xl" />
                ) : (
                  <FaUser className="text-indigo-600 text-2xl" />
                )}
              </div>
              <h1 className="mb-2 font-bold text-gray-800 text-2xl">
                {forgotPasswordMode
                  ? forgotPasswordStep === 1
                    ? "Reset Your Password"
                    : forgotPasswordStep === 2
                    ? "Verify Your Identity"
                    : "Create New Password"
                  : "Welcome Back"}
              </h1>
              <p className="text-gray-600">
                {forgotPasswordMode
                  ? forgotPasswordStep === 1
                    ? "Enter your email to reset your password"
                    : forgotPasswordStep === 2
                    ? "Enter the verification code sent to your email"
                    : "Please enter your new password"
                  : "Sign in to access your healthcare dashboard"}
              </p>
            </div>

            {/* Message Display */}
            {message.text && (
              <div
                className={`mb-6 p-3 rounded-lg text-center ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <AnimatePresence mode="wait">
              {!forgotPasswordMode ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={Handler}
                  className="space-y-6"
                >
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="py-3 pr-4 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">
                      Password
                    </label>
                    <div className="relative">
                      <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                        <FaKey className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="py-3 pr-12 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="right-0 absolute inset-y-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <button
                        type="button"
                        onClick={() => setForgotPasswordMode(true)}
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
                    className="relative bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg px-4 py-3 rounded-lg w-full overflow-hidden font-medium text-white transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex justify-center items-center">
                        <svg
                          className="mr-2 w-5 h-5 text-white animate-spin"
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
                </motion.form>
              ) : (
                <motion.div
                  key="forgot-password-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {forgotPasswordStep === 1 && (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="py-3 pr-4 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setForgotPasswordMode(false)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg font-medium text-gray-700 transition-colors"
                        >
                          Back to Login
                        </button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg px-4 py-3 rounded-lg font-medium text-white transition-all"
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Send OTP"}
                        </motion.button>
                      </div>
                    </form>
                  )}

                  {forgotPasswordStep === 2 && (
                    <form
                      onSubmit={handleForgotPasswordOtp}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">
                          Verification Code
                        </label>
                        <p className="mb-4 text-gray-600 text-sm">
                          Enter the 6-digit code sent to {otpEmail}
                        </p>
                        <div className="flex justify-between mb-2">
                          {Array.from({ length: 6 }, (_, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength={1}
                              ref={(el) => (inputRef.current[index] = el)}
                              onKeyDown={(e) => {
                                if (e.key === "Backspace") {
                                  if (e.target.value === "" && index > 0) {
                                    inputRef.current[index - 1].focus();
                                  }
                                }
                              }}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                if (e.target.value.length === 1 && index < 5) {
                                  inputRef.current[index + 1].focus();
                                }
                                // Update the OTP state
                                const otpArray = [...otp.split("")];
                                otpArray[index] = e.target.value;
                                setOtp(otpArray.join(""));
                              }}
                              className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-12 h-12 text-black text-lg text-center"
                              required
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setForgotPasswordStep(1)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg font-medium text-gray-700 transition-colors"
                        >
                          Change Email
                        </button>
                        <button
                          type="button"
                          onClick={handleResendForgotPasswordOtp}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg font-medium text-gray-700 transition-colors"
                        >
                          Resend OTP
                        </button>
                        <button
                          type="submit"
                          disabled={isOtpLoading || otp.length !== 6}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 px-4 py-3 rounded-lg font-medium text-white transition-colors"
                        >
                          {isOtpLoading ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                    </form>
                  )}

                  {forgotPasswordStep === 3 && (
                    <form onSubmit={handlePasswordReset} className="space-y-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                            <FaKey className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="py-3 pr-12 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="right-0 absolute inset-y-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 transition-colors"
                          >
                            {showPassword ? (
                              <FaEyeSlash size={18} />
                            ) : (
                              <FaEye size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                            <FaKey className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="py-3 pr-4 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setForgotPasswordStep(2)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg font-medium text-gray-700 transition-colors"
                        >
                          Back
                        </button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg px-4 py-3 rounded-lg font-medium text-white transition-all"
                          disabled={
                            isLoading || newPassword !== confirmPassword
                          }
                        >
                          {isLoading ? "Resetting..." : "Reset Password"}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!forgotPasswordMode && (
              <div className="mt-8">
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
            )}
          </div>
        </div>
      </motion.div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-2xl w-full max-w-md"
            >
              <div className="mb-6 text-center">
                <div className="inline-flex bg-indigo-100 mb-4 p-3 rounded-full">
                  <FaEnvelope className="text-indigo-600 text-2xl" />
                </div>
                <h2 className="font-bold text-gray-800 text-2xl">
                  Verify Your Email
                </h2>
                <p className="mt-2 text-gray-600">
                  Enter the OTP sent to {otpEmail}
                </p>
              </div>

              <form onSubmit={handleOtpVerification} className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Verification Code
                  </label>
                  <div className="flex justify-between mb-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        ref={(el) => (inputRef.current[index] = el)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            if (e.target.value === "" && index > 0) {
                              inputRef.current[index - 1].focus();
                            }
                          }
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                          if (e.target.value.length === 1 && index < 5) {
                            inputRef.current[index + 1].focus();
                          }
                          // Update the OTP state
                          const otpArray = [...otp.split("")];
                          otpArray[index] = e.target.value;
                          setOtp(otpArray.join(""));
                        }}
                        className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-12 h-12 text-black text-lg text-center"
                        required
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg font-medium text-gray-700 transition-colors"
                  >
                    Resend OTP
                  </button>
                  <button
                    type="submit"
                    disabled={isOtpLoading || otp.length !== 6}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 px-4 py-3 rounded-lg font-medium text-white transition-colors"
                  >
                    {isOtpLoading ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </form>

              <button
                onClick={() => setShowOtpModal(false)}
                className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm text-center"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
