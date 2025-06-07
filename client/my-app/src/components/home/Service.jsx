import React, { useState } from "react";
import {
  FaStethoscope,
  FaUserNurse,
  FaPills,
  FaClinicMedical,
  FaFemale,
  FaBrain,
  FaBed,
  FaHeartbeat,
  FaTimes,
} from "react-icons/fa";

import MedicalServices from "./MedicalService";

const OurServices = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      name: "Medical Checkup",
      icon: <FaStethoscope className="text-blue-500" />,
      article:
        "Our comprehensive medical checkups include full-body examinations, blood tests, and diagnostic screenings. Conducted by board-certified physicians using state-of-the-art equipment, our checkups help detect health issues early and provide personalized health recommendations.",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Nursing Service",
      icon: <FaUserNurse className="text-green-500" />,
      article:
        "Our skilled nursing team provides 24/7 care with compassion and expertise. Services include post-operative care, wound management, medication administration, and chronic disease management. All nurses are licensed and receive continuous training.",
      image:
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Pharmacy",
      icon: <FaPills className="text-purple-500" />,
      article:
        "Our in-house pharmacy stocks a comprehensive range of medications with licensed pharmacists available for consultation. We offer medication therapy management, prescription compounding, and home delivery services for patient convenience.",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Emergency Care",
      icon: <FaClinicMedical className="text-red-500" />,
      article:
        "Our emergency department operates 24/7 with board-certified emergency physicians and trauma specialists. Equipped with advanced life support systems, we maintain an average response time of under 5 minutes for critical cases.",
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Gyn Care",
      icon: <FaFemale className="text-pink-500" />,
      article:
        "Our women's health center provides comprehensive gynecological services including annual exams, prenatal care, fertility treatments, and minimally invasive surgeries. We create a comfortable environment with female practitioners available upon request.",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Neurology",
      icon: <FaBrain className="text-indigo-500" />,
      article:
        "Our neurology department specializes in treating disorders of the nervous system with cutting-edge diagnostic tools like 3T MRI and EEG. Conditions treated include epilepsy, migraines, Parkinson's disease, and multiple sclerosis.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Sleep Center",
      icon: <FaBed className="text-yellow-500" />,
      article:
        "Our accredited sleep center diagnoses and treats sleep disorders including insomnia, sleep apnea, and narcolepsy. We conduct overnight sleep studies in comfortable, hotel-like rooms with advanced polysomnography technology.",
      image:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Cardiology",
      icon: <FaHeartbeat className="text-teal-500" />,
      article:
        "Our cardiac care team provides comprehensive heart health services including stress tests, echocardiograms, angioplasty, and bypass surgeries. We feature a dedicated cardiac ICU and rehabilitation program for complete care.",
      image:
        "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="font-extrabold text-gray-900 text-4xl sm:text-5xl">
            Our Medical Services
          </h1>
          <div className="bg-blue-600 mx-auto mt-6 w-24 h-1.5"></div>
          <p className="mx-auto mt-6 max-w-3xl text-gray-600 text-xl">
            Comprehensive healthcare services delivered with compassion and
            cutting-edge technology
          </p>
        </div>

        <div className="gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white shadow-lg hover:shadow-xl p-8 border border-gray-100 rounded-xl h-full text-center transition-all duration-300"
            >
              <div className="mb-6 text-5xl">{service.icon}</div>
              <h3 className="mb-4 font-semibold text-gray-900 text-2xl">
                {service.name}
              </h3>
              <p className="flex-grow mb-6 text-gray-600">
                {service.article.substring(0, 120)}...
              </p>
              <button
                onClick={() => setSelectedService(service)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg w-full font-medium text-white transition-colors"
              >
                Read More
              </button>
            </div>
          ))}
        </div>

        {/* Service Detail Modal */}
        {selectedService && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="rounded-t-xl w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedService(null)}
                  className="top-4 right-4 absolute bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full"
                >
                  <FaTimes className="text-gray-700 text-xl" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex justify-center items-center mb-6">
                  <div className="mr-4 text-4xl">{selectedService.icon}</div>
                  <h2 className="font-bold text-gray-900 text-3xl">
                    {selectedService.name}
                  </h2>
                </div>

                <div className="max-w-none text-gray-700 prose prose-lg">
                  <p>{selectedService.article}</p>

                  <h3 className="mt-8 mb-4 font-semibold text-gray-900 text-xl">
                    Key Features
                  </h3>
                  <ul className="space-y-2 pl-5 list-disc">
                    <li>Board-certified specialists</li>
                    <li>State-of-the-art equipment</li>
                    <li>Personalized treatment plans</li>
                    <li>Compassionate patient care</li>
                  </ul>

                  <h3 className="mt-8 mb-4 font-semibold text-gray-900 text-xl">
                    What to Expect
                  </h3>
                  <p>
                    Your first visit will include a comprehensive consultation,
                    diagnostic tests if needed, and a customized treatment plan.
                    Our team will guide you through every step of your
                    healthcare journey.
                  </p>
                </div>

                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium text-white transition-colors"
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
