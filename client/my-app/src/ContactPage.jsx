import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaPaperPlane,
  FaCheck,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EthiopianNames = [
  "Abebe Kebede",
  "Alemnesh Bekele",
  "Tewodros Assefa",
  "Selamawit Girma",
];

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);

  const API_CONFIG = {
    url:
      import.meta.env.VITE_WEB3FORMS_API_URL ||
      "https://api.web3forms.com/submit",
    accessKey:
      import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
      "ac0d29f4-db7c-4c2e-8767-cf9bee9f7ac1",
  };

  const getRandomPlaceholder = (type) => {
    if (type === "name")
      return EthiopianNames[Math.floor(Math.random() * EthiopianNames.length)];
    if (type === "phone") return "0943599259";
    return "";
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const response = await fetch(API_CONFIG.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: API_CONFIG.accessKey,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          subject: "Dersan Desu  Hospital",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        toast.success("Message sent successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error.message || "Failed to send message. Please try again.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const contactCards = [
    {
      icon: <FaPhone className="text-2xl" />,
      title: "CALL US",
      details: ["+251 123 456 789", "+251 987 654 321"],
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      delay: 0.2,
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "LOCATION",
      details: ["Addis Ababa, Ethiopia", "Bole Subcity, Woreda 03"],
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      delay: 0.4,
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "BUSINESS HOURS",
      details: ["Mon - Fri: 8:30 am - 5:30 pm", "Sat: 9 am - 1 pm"],
      color: "bg-gradient-to-br from-violet-500 to-violet-600",
      delay: 0.6,
    },
  ];

  if (isSubmitted) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4 py-16 min-h-screen"
      >
        <motion.div className="bg-white shadow-2xl mx-auto p-10 rounded-2xl w-full max-w-4xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-green-100 p-4 rounded-full">
              <FaCheck className="text-green-600 text-4xl" />
            </div>
          </motion.div>
          <h3 className="mb-4 font-bold text-gray-800 text-3xl">Thank You!</h3>
          <p className="mb-6 text-gray-600">
            Your message has been sent successfully. We'll get back to you soon.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-[#212A5E] hover:bg-[#1a2258] px-6 py-3 rounded-lg text-white transition-colors"
          >
            Send Another Message
          </button>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-64 md:h-96 overflow-hidden"
      >
        <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-r from-[#212A5E] to-[#3A56A5]">
          <div className="px-4 text-center">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-4 font-bold text-white text-3xl md:text-5xl"
            >
              Get in Touch
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white mx-auto mb-6 w-24 h-1"
            ></motion.div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mx-auto max-w-2xl text-blue-100 text-lg"
            >
              We'd love to hear from you! Contact us for any inquiries.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="z-10 relative mx-auto px-4 py-12 md:py-20 container">
        <div className="gap-12 grid grid-cols-1 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#212A5E] to-[#3A56A5] p-6 text-white">
              <h2 className="flex items-center font-bold text-2xl md:text-3xl">
                <span className="mr-3">✉️</span> Send Us a Message
              </h2>
              <p className="mt-2 text-blue-100">
                We typically respond within 24 hours
              </p>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  {
                    id: "name",
                    type: "text",
                    placeholder: getRandomPlaceholder("name"),
                  },
                  {
                    id: "email",
                    type: "email",
                    placeholder: "you@example.com",
                  },
                  {
                    id: "phone",
                    type: "tel",
                    placeholder: "0943599259",
                  },
                  {
                    id: "message",
                    type: "textarea",
                    placeholder: "How can we help you?",
                  },
                ].map((field) => (
                  <div key={field.id} className="relative">
                    <label
                      htmlFor={field.id}
                      className={`absolute left-4  top-3 transition-all duration-300 ${
                        formData[field.id] || hoveredField === field.id
                          ? "text-xs -translate-y-5 text-[#212A5E]"
                          : "text-gray-500"
                      }`}
                      onMouseEnter={() => setHoveredField(field.id)}
                      onMouseLeave={() => setHoveredField(null)}
                    >
                      {field.icon} {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.id}
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        onFocus={() => setHoveredField(field.id)}
                        onBlur={() => setHoveredField(null)}
                        rows="5"
                        placeholder={field.placeholder}
                        className={`px-4 pt-6 pb-2 text-black border ${
                          errors[field.id]
                            ? "border-red-300"
                            : "border-gray-300"
                        } focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212A5E] w-full transition duration-300 resize-none`}
                        required={field.id !== "phone"}
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        onFocus={() => setHoveredField(field.id)}
                        onBlur={() => setHoveredField(null)}
                        placeholder={field.placeholder}
                        className={`px-4 pt-6 text-black pb-2 border ${
                          errors[field.id]
                            ? "border-red-300"
                            : "border-gray-300"
                        } focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212A5E] w-full transition duration-300`}
                        required={field.id !== "phone"}
                        onKeyPress={
                          field.id === "phone"
                            ? (e) => !/[0-9]/.test(e.key) && e.preventDefault()
                            : null
                        }
                        maxLength={field.id === "phone" ? "10" : null}
                      />
                    )}
                    {errors[field.id] && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-red-500 text-sm"
                      >
                        {errors[field.id]}
                      </motion.p>
                    )}
                  </div>
                ))}

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 20px -5px rgba(33, 42, 94, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center items-center space-x-3 bg-gradient-to-r from-[#212A5E] hover:from-[#1a2258] to-[#3A56A5] hover:to-[#2d4078] shadow-lg px-6 py-4 rounded-lg w-full font-bold text-white transition-all duration-300"
                >
                  {isLoading ? (
                    <svg
                      className="w-5 h-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="white"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <>
                      <span className="text-lg">Send Message</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <FaPaperPlane className="text-lg" />
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Floating Contact Cards */}
            {contactCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay, duration: 0.6 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                className={`${card.color} text-white p-6 rounded-2xl shadow-xl transition-all duration-300`}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="mb-2 font-bold text-xl">{card.title}</h3>
                    {card.details.map((detail, i) => (
                      <p key={i} className="text-white/90 leading-relaxed">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Additional Information Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="relative bg-white shadow-lg p-6 border-[#3A56A5] border-l-4 rounded-r-xl overflow-hidden"
            >
              <div className="top-0 left-0 absolute bg-[#3A56A5] w-1 h-full"></div>
              <div className="flex items-start pl-4">
                <div className="bg-blue-100 mr-4 p-3 rounded-full text-[#3A56A5]">
                  <FaStar className="text-xl" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-[#212A5E] text-xl">
                    Our Commitment
                  </h3>
                  <p className="text-gray-700">
                    We are dedicated to providing excellent service and timely
                    responses to all inquiries.
                  </p>
                  <p className="mt-2 text-gray-500 text-sm">
                    Your satisfaction is our priority
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Map Button */}
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{
                y: -3,
                boxShadow: "0 5px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              href="#"
              className="block flex justify-center items-center space-x-3 bg-white shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 rounded-2xl w-full font-bold text-[#212A5E] text-center transition-all duration-300"
            >
              <span>📍 Find Us on Map</span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                👆
              </motion.span>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
