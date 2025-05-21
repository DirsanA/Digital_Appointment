import React, { useState } from "react";
import { FaAward, FaClinicMedical, FaFlask, FaUserMd, FaHeartbeat } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("mission");
  const [hoveredValue, setHoveredValue] = useState(null);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white">
      {/* Animated Header */}
      <div className="relative flex justify-center items-center bg-blue-900 h-96 overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-90"></div>
        <motion.div 
          className="z-10 relative px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 className="mb-6 font-bold text-white text-5xl md:text-7xl" variants={fadeIn}>
            <span>About</span>{" "}
            <span className="text-blue-300">D²</span>{" "}
            <span>Hospital</span>
          </motion.h1>
          <motion.div 
            className="bg-blue-400 mx-auto mb-8 w-24 h-1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.p className="mx-auto max-w-2xl text-blue-100 text-xl" variants={fadeIn}>
            Redefining healthcare excellence through innovation and compassion since 1995
          </motion.p>
        </motion.div>
      </div>

      {/* Core Content */}
      <div className="mx-auto px-4 py-20 max-w-6xl">
        {/* Stats Grid */}
        <motion.div 
          className="gap-6 grid grid-cols-2 md:grid-cols-4 mb-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {[
            { number: "25+", label: "Years of Excellence", icon: <FaAward className="text-blue-600 text-2xl" /> },
            { number: "200+", label: "Specialist Doctors", icon: <FaUserMd className="text-blue-600 text-2xl" /> },
            { number: "98%", label: "Patient Satisfaction", icon: <FaHeartbeat className="text-blue-600 text-2xl" /> },
            { number: "50K+", label: "Patients Annually", icon: <FaClinicMedical className="text-blue-600 text-2xl" /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-sm hover:shadow-lg p-6 border border-blue-100 rounded-xl transition-all duration-300"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <div className="mb-3">{stat.icon}</div>
              <div className="mb-2 font-bold text-blue-800 text-4xl">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabbed Content */}
        <div className="mb-20">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: "mission", label: "Our Mission" },
              { id: "values", label: "Core Values" },
              { id: "history", label: "Our Journey" },
              { id: "facilities", label: "Our Facilities" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium rounded-full transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === "mission" && (
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white shadow-sm p-8 border border-blue-50 rounded-2xl">
                    <h3 className="mb-6 font-bold text-gray-800 text-3xl">
                      Our Commitment to Healthcare Excellence
                    </h3>
                    <p className="mb-6 text-gray-600 text-lg leading-relaxed">
                      At D² Hospital, we combine cutting-edge medical technology
                      with compassionate care to deliver exceptional healthcare
                      services. Our team of specialists across 30 departments is
                      committed to your well-being through every stage of life.
                    </p>
                    <div className="gap-8 grid md:grid-cols-2">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-blue-700 text-xl">
                          <span className="inline-block bg-blue-100 mr-2 rounded-full w-6 h-6 text-blue-700 text-center">
                            ✓
                          </span>
                          Clinical Excellence
                        </h4>
                        <p className="text-gray-600">
                          Board-certified physicians utilizing evidence-based
                          medicine and the latest treatment protocols.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-blue-700 text-xl">
                          <span className="inline-block bg-blue-100 mr-2 rounded-full w-6 h-6 text-blue-700 text-center">
                            ✓
                          </span>
                          Patient-Centered Care
                        </h4>
                        <p className="text-gray-600">
                          Personalized treatment plans tailored to each patient's
                          unique needs and circumstances.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "values" && (
                <motion.div
                  className="gap-6 grid md:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {[
                    {
                      title: "Compassion",
                      description:
                        "Treating every patient with empathy, dignity and kindness in all interactions.",
                      color: "from-blue-100 to-blue-50",
                    },
                    {
                      title: "Innovation",
                      description:
                        "Embracing cutting-edge technologies and treatment methodologies to improve outcomes.",
                      color: "from-purple-100 to-purple-50",
                    },
                    {
                      title: "Integrity",
                      description:
                        "Maintaining the highest ethical standards in all our decisions and actions.",
                      color: "from-teal-100 to-teal-50",
                    },
                    {
                      title: "Excellence",
                      description:
                        "Striving for the highest quality in patient care, service and clinical outcomes.",
                      color: "from-indigo-100 to-indigo-50",
                    },
                    {
                      title: "Collaboration",
                      description:
                        "Working together across disciplines to provide comprehensive, coordinated care.",
                      color: "from-cyan-100 to-cyan-50",
                    },
                    {
                      title: "Community",
                      description:
                        "Serving and improving the health of our local and global communities.",
                      color: "from-sky-100 to-sky-50",
                    },
                  ].map((value, index) => (
                    <motion.div
                      key={index}
                      className={`bg-gradient-to-br ${value.color} p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 h-full`}
                      onMouseEnter={() => setHoveredValue(index)}
                      onMouseLeave={() => setHoveredValue(null)}
                      whileHover={{ y: -5 }}
                    >
                      <h4 className="relative mb-4 font-bold text-gray-800 text-2xl">
                        <span
                          className={`absolute -left-2 w-1 h-8 bg-blue-600 rounded-full transition-all duration-300 ${
                            hoveredValue === index ? "opacity-100" : "opacity-0"
                          }`}
                        ></span>
                        {value.title}
                      </h4>
                      <p className="text-gray-600">{value.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white shadow-sm p-8 border border-blue-50 rounded-2xl">
                    <h3 className="mb-6 font-bold text-gray-800 text-3xl">
                      Our Journey Through the Years
                    </h3>
                    <p className="mb-6 text-gray-600 text-lg leading-relaxed">
                      From humble beginnings to becoming a regional healthcare leader, 
                      D² Hospital has consistently pushed the boundaries of medical 
                      excellence while staying true to our founding principles.
                    </p>
                    
                    <div className="relative">
                      {/* Timeline */}
                      <div className="border-l-2 border-blue-200 pl-8 space-y-10">
                        {[
                          {
                            year: "1995",
                            title: "Foundation",
                            description: "Established as a 50-bed general hospital with focus on community healthcare"
                          },
                          {
                            year: "2002",
                            title: "First Expansion",
                            description: "Added specialized cardiac care unit and expanded to 150 beds"
                          },
                          {
                            year: "2010",
                            title: "JCI Accreditation",
                            description: "Achieved international accreditation for quality and patient safety standards"
                          },
                          {
                            year: "2018",
                            title: "Research Center",
                            description: "Opened state-of-the-art medical research facility with university partnerships"
                          },
                          {
                            year: "2022",
                            title: "Digital Transformation",
                            description: "Implemented AI-assisted diagnostics and fully integrated electronic health records"
                          }
                        ].map((milestone, index) => (
                          <motion.div 
                            key={index}
                            className="relative pb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="absolute -left-11 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                              {milestone.year}
                            </div>
                            <h4 className="font-bold text-xl text-blue-800 mb-2">{milestone.title}</h4>
                            <p className="text-gray-600">{milestone.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "facilities" && (
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white shadow-sm p-8 border border-blue-50 rounded-2xl">
                    <h3 className="mb-6 font-bold text-gray-800 text-3xl">
                      World-Class Medical Facilities
                    </h3>
                    <p className="mb-6 text-gray-600 text-lg leading-relaxed">
                      Our 300-bed tertiary care hospital features the most advanced 
                      medical technology in the region, supported by specialized 
                      centers of excellence across all major medical disciplines.
                    </p>
                    
                    <div className="gap-6 grid md:grid-cols-2">
                      {[
                        {
                          title: "Cardiac Center",
                          description: "Featuring hybrid ORs, 24/7 cath lab, and advanced ECMO capabilities",
                          icon: <FaHeartbeat className="text-red-500 text-3xl" />
                        },
                        {
                          title: "Neuroscience Institute",
                          description: "With intraoperative MRI, robotic-assisted neurosurgery, and stroke center",
                          icon: <FaFlask className="text-blue-500 text-3xl" />
                        },
                        {
                          title: "Cancer Center",
                          description: "Comprehensive oncology services including proton therapy and precision medicine",
                          icon: <FaClinicMedical className="text-purple-500 text-3xl" />
                        },
                        {
                          title: "Women's Health",
                          description: "From advanced fertility treatments to robotic gynecologic surgery",
                          icon: <FaUserMd className="text-pink-500 text-3xl" />
                        }
                      ].map((facility, index) => (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                          whileHover={{ y: -5 }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="bg-white p-3 rounded-full shadow-sm">
                              {facility.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-xl text-gray-800 mb-2">
                                {facility.title}
                              </h4>
                              <p className="text-gray-600">
                                {facility.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                      <h4 className="font-bold text-xl text-blue-800 mb-3">
                        Supporting Infrastructure
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                        <li className="flex items-center">
                          <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3">✓</span>
                          24/7 emergency and trauma center
                        </li>
                        <li className="flex items-center">
                          <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3">✓</span>
                          Advanced diagnostic imaging (3T MRI, PET-CT)
                        </li>
                        <li className="flex items-center">
                          <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3">✓</span>
                          Fully automated laboratory
                        </li>
                        <li className="flex items-center">
                          <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3">✓</span>
                          Helipad for critical care transport
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Accolades Section */}
        <motion.div 
          className="bg-blue-900 mb-20 p-8 md:p-12 rounded-2xl text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-8 font-bold text-3xl text-center">
            Recognized Excellence
          </h3>
          <div className="gap-8 grid md:grid-cols-3">
            {[
              {
                title: "JCI Accredited",
                description:
                  "Meeting international healthcare standards for quality and patient safety",
                icon: "🏆",
              },
              {
                title: "Top 100 Hospitals",
                description:
                  "Consistently ranked among the nation's best healthcare providers",
                icon: "⭐",
              },
              {
                title: "Patient Safety",
                description:
                  "Awarded for exceptional safety standards and infection control",
                icon: "🛡️",
              },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="mb-4 text-5xl">{item.icon}</div>
                <h4 className="mb-2 font-bold text-blue-200 text-xl">
                  {item.title}
                </h4>
                <p className="text-blue-100">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-6 font-bold text-gray-800 text-3xl">
            Experience the D² Difference
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600 text-xl">
            Our doors are open to provide you with exceptional healthcare when
            you need it most.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button 
              className="bg-blue-600 hover:bg-blue-700 shadow-lg px-8 py-3 rounded-full font-semibold text-white text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Meet Our Team
            </motion.button>
            <motion.button 
              className="hover:bg-blue-50 px-8 py-3 border-2 border-blue-600 rounded-full font-semibold text-blue-600 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Virtual Tour
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Animated Divider */}
      <motion.div 
        className="relative bg-gradient-to-r from-blue-400 to-blue-600 h-1 overflow-hidden"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </motion.div>
    </div>
  );
};

export default AboutUs;