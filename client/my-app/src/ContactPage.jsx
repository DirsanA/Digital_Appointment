import React, { useState } from "react";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaStar,
  FaAmbulance,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import hospitalImage from "./assets/5.jpg";
import doctorImage from "./assets/doctor4.jpg";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    acceptTerms: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
    setFormData({
      name: "",
      email: "",
      message: "",
      acceptTerms: false,
    });
  };

  const contactCards = [
    {
      icon: <FaPhone className="text-2xl" />,
      title: "CALL US",
      details: ["1 (234) 567-891", "1 (234) 987-654"],
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      delay: 0.2,
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "LOCATION",
      details: ["121 Rock Street, 21 Avenue", "New York, NY 92103-9000"],
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      delay: 0.4,
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "HOURS",
      details: ["Mon - Fri: 11 am - 8 pm", "Sat, Sun: 6 am - 8 pm"],
      color: "bg-gradient-to-br from-violet-500 to-violet-600",
      delay: 0.6,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Animated Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-80 md:h-[30rem] overflow-hidden"
      >
        <motion.img
          src={hospitalImage}
          alt="Hospital"
          className="w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex justify-center items-end bg-gradient-to-t from-blue-900/70 via-blue-900/40 to-transparent pb-12 md:pb-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="px-4 text-center"
          >
            <h1 className="mb-4 font-bold text-white text-4xl md:text-6xl">
              We're Here to Help
            </h1>
            <div className="bg-white mx-auto mb-6 w-24 h-1"></div>
            <p className="mx-auto max-w-2xl text-blue-100 text-xl">
              Contact our friendly team for any questions about our services or
              to book an appointment
            </p>
          </motion.div>
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <h2 className="flex items-center font-bold text-2xl md:text-3xl">
                <span className="mr-3">✉️</span> Send Us a Message
              </h2>
              <p className="mt-2 text-blue-100">
                We typically respond within 24 hours
              </p>
            </div>

            <div className="p-6 md:p-8">
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-100 mb-6 p-4 border-green-500 border-l-4 rounded text-green-700"
                  >
                    <p className="font-medium">
                      🎉 Thank you for your message!
                    </p>
                    <p>Our team will get back to you shortly.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { id: "name", label: "Your Name", type: "text", icon: "👤" },
                  {
                    id: "email",
                    label: "Email Address",
                    type: "email",
                    icon: "✉️",
                  },
                  {
                    id: "message",
                    label: "Your Message",
                    type: "textarea",
                    icon: "💬",
                  },
                ].map((field) => (
                  <div key={field.id} className="relative">
                    <label
                      htmlFor={field.id}
                      className={`absolute left-4 top-3 transition-all duration-300 ${
                        formData[field.id] || hoveredField === field.id
                          ? "text-xs -translate-y-5 text-blue-600"
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
                        className="px-4 pt-6 pb-2 border border-gray-300 focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-300 resize-none"
                        required
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
                        className="px-4 pt-6 pb-2 border border-gray-300 focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-300"
                        required
                      />
                    )}
                  </div>
                ))}

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="border-gray-300 rounded focus:ring-blue-500 w-4 h-4 text-blue-600"
                      required
                    />
                  </div>
                  <label
                    htmlFor="acceptTerms"
                    className="ml-3 text-gray-700 text-sm"
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 20px -5px rgba(59, 130, 246, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex justify-center items-center space-x-3 bg-gradient-to-r from-blue-600 hover:from-blue-700 to-blue-800 hover:to-blue-900 shadow-lg px-6 py-4 rounded-lg w-full font-bold text-white transition-all duration-300"
                >
                  <span className="text-lg">Send Message</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <FaPaperPlane className="text-lg" />
                  </motion.span>
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

            {/* Emergency Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="relative bg-white shadow-lg p-6 border-red-500 border-l-4 rounded-r-xl overflow-hidden"
            >
              <div className="top-0 left-0 absolute bg-red-500 w-1 h-full"></div>
              <div className="flex items-start pl-4">
                <div className="bg-red-100 mr-4 p-3 rounded-full text-red-500">
                  <FaAmbulance className="text-xl" />
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-red-600 text-xl">
                    Emergency Contact
                  </h3>
                  <p className="text-gray-700">
                    For urgent medical assistance, please call:
                  </p>
                  <p className="mt-2 font-bold text-red-600 text-2xl">911</p>
                  <p className="mt-2 text-gray-500 text-sm">
                    Available 24 hours, 7 days a week
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
              className="block flex justify-center items-center space-x-3 bg-white shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 rounded-2xl w-full font-bold text-blue-700 text-center transition-all duration-300"
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

export default ContactPage;
