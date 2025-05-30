import React, { useState } from 'react';
import { 
  FaStethoscope, 
  FaUserNurse, 
  FaPills, 
  FaClinicMedical,
  FaFemale,
  FaBrain,
  FaBed,
  FaHeartbeat,
  FaTimes
} from 'react-icons/fa';

import MedicalServices from './MedicalService';

const OurServices = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { 
      name: "Medical Checkup", 
      icon: <FaStethoscope className="text-blue-500" />,
      article: "Our comprehensive medical checkups include full-body examinations, blood tests, and diagnostic screenings. Conducted by board-certified physicians using state-of-the-art equipment, our checkups help detect health issues early and provide personalized health recommendations.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Nursing Service", 
      icon: <FaUserNurse className="text-green-500" />,
      article: "Our skilled nursing team provides 24/7 care with compassion and expertise. Services include post-operative care, wound management, medication administration, and chronic disease management. All nurses are licensed and receive continuous training.",
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Pharmacy", 
      icon: <FaPills className="text-purple-500" />,
      article: "Our in-house pharmacy stocks a comprehensive range of medications with licensed pharmacists available for consultation. We offer medication therapy management, prescription compounding, and home delivery services for patient convenience.",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Emergency Care", 
      icon: <FaClinicMedical className="text-red-500" />,
      article: "Our emergency department operates 24/7 with board-certified emergency physicians and trauma specialists. Equipped with advanced life support systems, we maintain an average response time of under 5 minutes for critical cases.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Gyn Care", 
      icon: <FaFemale className="text-pink-500" />,
      article: "Our women's health center provides comprehensive gynecological services including annual exams, prenatal care, fertility treatments, and minimally invasive surgeries. We create a comfortable environment with female practitioners available upon request.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Neurology", 
      icon: <FaBrain className="text-indigo-500" />,
      article: "Our neurology department specializes in treating disorders of the nervous system with cutting-edge diagnostic tools like 3T MRI and EEG. Conditions treated include epilepsy, migraines, Parkinson's disease, and multiple sclerosis.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Sleep Center", 
      icon: <FaBed className="text-yellow-500" />,
      article: "Our accredited sleep center diagnoses and treats sleep disorders including insomnia, sleep apnea, and narcolepsy. We conduct overnight sleep studies in comfortable, hotel-like rooms with advanced polysomnography technology.",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    { 
      name: "Cardiology", 
      icon: <FaHeartbeat className="text-teal-500" />,
      article: "Our cardiac care team provides comprehensive heart health services including stress tests, echocardiograms, angioplasty, and bypass surgeries. We feature a dedicated cardiac ICU and rehabilitation program for complete care.",
      image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Our Medical Services
          </h1>
          <div className="mt-6 w-24 h-1.5 bg-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services delivered with compassion and cutting-edge technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center h-full"
            >
              <div className="mb-6 text-5xl">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                {service.article.substring(0, 120)}...
              </p>
              <button 
                onClick={() => setSelectedService(service)}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors w-full"
              >
                Read More
              </button>
            </div>
          ))}
        </div>

        {/* Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-700 text-xl" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="text-4xl mr-4">
                    {selectedService.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedService.name}
                  </h2>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700">
                  <p>{selectedService.article}</p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Board-certified specialists</li>
                    <li>State-of-the-art equipment</li>
                    <li>Personalized treatment plans</li>
                    <li>Compassionate patient care</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">What to Expect</h3>
                  <p>Your first visit will include a comprehensive consultation, diagnostic tests if needed, and a customized treatment plan. Our team will guide you through every step of your healthcare journey.</p>
                </div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <MedicalServices />
    </div>
  );
};

export default OurServices;