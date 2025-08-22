import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaKey,
  FaClinicMedical,
  FaShieldAlt,
  FaMobileAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PatientRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [currentStep, setCurrentStep] = useState(1);

  const inputRef = useRef([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^09\d{8}$/.test(phone);
  const isValidPassword = (password) => password.length >= 6;

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      return setMessage({ type: "error", text: "All fields are required" });
    }
    if (!isValidEmail(formData.email)) {
      return setMessage({ type: "error", text: "Please enter a valid email." });
    }
    if (!isValidPhone(formData.phone)) {
      return setMessage({
        type: "error",
        text: "Phone must start with 09 and be 10 digits.",
      });
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      return setMessage({
        type: "error",
        text: "Password fields are required",
      });
    }
    if (!isValidPassword(formData.password)) {
      return setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
    }
    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords don't match!" });
    }
    return true;
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (e.target.value === "" && index > 0) {
        inputRef.current[index - 1].focus();
      } else {
        e.target.value = "";
      }
    }
  };

  const handleInput = (e, index) => {
    e.target.value = e.target.value.replace(/\D/g, "");
    if (e.target.value.length === 1 && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    pasteData.split("").forEach((char, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = char;
      }
    });

    const lastFilledIndex = pasteData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
      inputRef.current[lastFilledIndex].focus();
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/patient/register",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
      );

      setMessage({
        type: "success",
        text: response.data.message || "OTP sent to your email!",
      });
      setShowOtpModal(true);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err);
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsOtpLoading(true);

    const otpValue = inputRef.current
      .map((input) => input.value.trim())
      .join("");

    if (otpValue.length !== 6) {
      setMessage({ type: "error", text: "Please enter the full 6-digit OTP." });
      setIsOtpLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/patient/verify-otp",
        {
          email: formData.email,
          otp: otpValue,
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Email verified successfully! Please login.",
        });

        // Auto login after successful verification
        try {
          const loginResponse = await axios.post(
            "http://localhost:5000/login",
            {
              email: formData.email,
              password: formData.password,
            }
          );

          if (loginResponse.data.token) {
            localStorage.setItem("token", loginResponse.data.token);
            localStorage.setItem("role", loginResponse.data.role);
            localStorage.setItem("userEmail", formData.email);
            localStorage.setItem(
              "loginTimestamp",
              new Date().getTime().toString()
            );

            if (loginResponse.data.patientId) {
              localStorage.setItem("patientId", loginResponse.data.patientId);
            }

            // Redirect to patient dashboard
            setTimeout(() => navigate("/Patient-Dashbord"), 1000);
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          // Redirect to login page if auto-login fails
          setTimeout(() => navigate("/login"), 2000);
        }
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
        { email: formData.email }
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

  const nextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      setMessage({ type: "", text: "" });
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    setMessage({ type: "", text: "" });
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
                <p className="text-sm">Join thousands of satisfied patients</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 w-full md:w-3/5">
            <div className="mb-6 text-center">
              <div className="inline-flex justify-center items-center bg-indigo-100 mb-4 p-3 rounded-full">
                <FaUserPlus className="text-indigo-600 text-2xl" />
              </div>
              <h1 className="mb-2 font-bold text-gray-800 text-2xl">
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Join our healthcare community and take control of your health
              </p>

              {/* Progress Steps */}
              <div className="flex justify-center mt-6">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep >= 1
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep >= 2 ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep >= 2
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg text-center ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <AnimatePresence mode="wait">
              {showOtpModal ? (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="mb-4 text-gray-600">
                      We've sent a 6-digit verification code to{" "}
                      <span className="font-semibold">{formData.email}</span>
                    </p>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 text-sm">
                        Verification Code
                      </label>
                      <div className="flex justify-between mb-4">
                        {Array.from({ length: 6 }, (_, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={(el) => (inputRef.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onInput={(e) => handleInput(e, index)}
                            onPaste={handlePaste}
                            required
                            className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-12 h-12 text-black text-lg text-center"
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isOtpLoading}
                      className="disabled:opacity-50 mt-3 font-medium text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleOtpVerification}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg px-4 py-3 rounded-lg w-full overflow-hidden font-medium text-white transition-all"
                    disabled={isOtpLoading}
                  >
                    {isOtpLoading ? (
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
                        Verifying...
                      </span>
                    ) : (
                      "Verify Account"
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="registration-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={
                    currentStep === 2
                      ? handleRegistration
                      : (e) => {
                          e.preventDefault();
                          nextStep();
                        }
                  }
                  className="space-y-4"
                >
                  <AnimatePresence mode="wait">
                    {currentStep === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block mb-2 font-medium text-gray-700 text-sm">
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                              <FaUser className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              className="py-3 pr-4 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                              required
                            />
                          </div>
                        </div>

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
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your@email.com"
                              className="py-3 pr-4 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-2 font-medium text-gray-700 text-sm">
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                              <FaPhone className="text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="0912345678"
                              className="py-3 pr-4 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                              required
                              maxLength="10"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
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
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="••••••••"
                              className="py-3 pr-12 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                              required
                              minLength="6"
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
                          <p className="mt-1 text-gray-500 text-xs">
                            Must be at least 6 characters
                          </p>
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
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="••••••••"
                              className="py-3 pr-4 pl-10 border border-gray-300 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full text-black transition-all"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 pt-2">
                    {currentStep === 2 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-lg w-1/3 font-medium text-gray-700 transition-colors"
                      >
                        Back
                      </button>
                    )}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg px-4 py-3 rounded-lg overflow-hidden font-medium text-white transition-all ${
                        currentStep === 2 ? "w-2/3" : "w-full"
                      }`}
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
                          {currentStep === 1
                            ? "Processing..."
                            : "Creating Account..."}
                        </span>
                      ) : currentStep === 1 ? (
                        "Continue"
                      ) : (
                        "Register Now"
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {!showOtpModal && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="border-gray-300 border-t w-full"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="bg-white hover:bg-gray-50 mt-4 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg w-full font-medium text-gray-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientRegister;
