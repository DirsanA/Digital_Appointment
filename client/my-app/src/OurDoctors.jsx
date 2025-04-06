import React, { useState } from 'react';
import { FaUserMd, FaPhone, FaEnvelope, FaClinicMedical, FaArrowLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useNavigate, Link } from "react-router-dom";
// Import your local images (adjust paths as needed)
import drAbreham from './assets/doc9.jpg';
import drSarah from './assets/doc2.jpg';
import drMichael from './assets/doc4.jpg';
import drEmily from './assets/doc8.jpg';

const OurDoctors = () => {
  const [showTableView, setShowTableView] = useState(false);
  const navigate = useNavigate();
  const doctors = [
    {
      id: 1,
      name: "Dr. Abreham",
      specialty: "Dentist",
      image: drAbreham,
      bio: "Specialized in cosmetic dentistry and dental implants with 10 years of experience. Graduated from Harvard Dental School.",
      phone: "+251907412708",
      email: "dr.abreham@gmail.com",
      availability: "Mon-Fri: 9AM-5PM",
      experience: "10 years"
    },
    {
      id: 2,
      name: "Dr. Saraha",
      specialty: "Cardiologist",
      image: drSarah,
      bio: "Board-certified cardiologist specializing in interventional procedures. Former chief resident at Johns Hopkins Hospital.",
      phone: "+251907412708",
      email: "dr.sahra@gmail.com",
      availability: "Mon-Wed, Fri: 8AM-4PM",
      experience: "12 years"
    },
    {
      id: 3,
      name: "Dr. Desu Mulat",
      specialty: "Neurologist",
      image: drMichael,
      bio: "Expert in treating complex neurological disorders. Published researcher in neurodegenerative diseases.",
      phone: "+251907412708",
      email: "dr.desu@gmail.com",
      availability: "Tue-Thu: 10AM-6PM",
      experience: "8 years"
    },
    {
      id: 4,
      name: "Dr. Dirsan Antehun",
      specialty: "Pediatrician",
      image: drEmily,
      bio: "Caring pediatrician with special interest in childhood immunology.",
      phone: "+251907412708",
      email: "dr.girsan@gmail.com",
      availability: "Mon-Fri: 8AM-3PM",
      experience: "7 years"
    }
  ];

  const toggleView = () => setShowTableView(!showTableView);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Expert Doctors
          </h1>
          <div className="mt-4 w-20 h-1 bg-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our team of highly qualified and compassionate healthcare professionals
          </p>
        </div>

        {showTableView ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold text-gray-800">All Doctors</h2>
              <button 
                onClick={toggleView}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" /> Back to cards
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{doctor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-600">{doctor.specialty}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-600">
                          <div className="flex items-center">
                            <FaPhone className="mr-1 text-sm" /> {doctor.phone}
                          </div>
                          <div className="flex items-center">
                            <FaEnvelope className="mr-1 text-sm" /> {doctor.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {doctor.availability}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {doctor.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700" onClick={() => navigate("/patient-login")}>
                          Contact us
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="absolute h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-xl font-bold text-white">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-300 font-medium">
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {doctor.experience} experience
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                      {doctor.bio}
                    </p>
                    
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="mr-2 text-blue-500" />
                        {doctor.availability}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaPhone className="mr-2 text-blue-500" />
                        {doctor.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaEnvelope className="mr-2 text-blue-500" />
                        {doctor.email}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                        onClick={() => navigate("/patient-login")}
                      >
                        <FaCalendarAlt className="mr-2" />
                        Contact us
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={toggleView}
                className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors flex items-center mx-auto"
              >
                View All Doctors in Table
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OurDoctors;