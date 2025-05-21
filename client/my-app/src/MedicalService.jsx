import React from 'react';
import { motion } from 'framer-motion';
import hospitalImage from './assets/bg.png'; // Replace with your image

const MedicalService = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-full min-h-[400px] rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={hospitalImage}
              alt="Modern Hospital Facility"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-blue-600">
                Future is here,
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Think Smart, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Think Smart HMIS
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                The Complete Hospital Management System
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600">
                Our comprehensive solution integrates all hospital operations into one seamless platform, 
                enhancing patient care and operational efficiency.
              </p>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Streamlined patient management</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure cloud-based infrastructure</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Request a Demo
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Client Testimonials Section (Replacing Stats) */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Healthcare Professionals
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Smart HMIS transformed our hospital operations completely. Patient wait times decreased by 40% in the first month.",
                name: "Dr. Sarah Johnson",
                title: "Chief Medical Officer, City General",
                avatar: "👩‍⚕️"
              },
              {
                quote: "The analytics dashboard gives us real-time insights we never had before. Game-changing for decision making.",
                name: "Michael Chen",
                title: "Hospital Administrator",
                avatar: "👨‍💼"
              },
              {
                quote: "Implementation was seamless and the support team is exceptional. Our staff adapted quicker than we expected.",
                name: "Nurse Emily Rodriguez",
                title: "Head Nurse, Regional Medical",
                avatar: "👩‍⚕️"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalService;