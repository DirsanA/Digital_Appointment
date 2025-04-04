import React, { useState } from 'react';
import { FaUserMd, FaPhone, FaEnvelope, FaClinicMedical, FaArrowLeft } from 'react-icons/fa';
// Import your local images (adjust paths as needed)
import drAbreham from './assets/doc9.jpg';
import drSarah from './assets/doc2.jpg';
import drMichael from './assets/doc4.jpg';
import drEmily from './assets/doc8.jpg';

const OurDoctors = () => {
  const [showTableView, setShowTableView] = useState(false);

  const doctors = [
    {
      id: 1,
      name: "Dr. Abreham",
      specialty: "Dentist",
      image: drAbreham,
      bio: "Specialized in cosmetic dentistry and dental implants with 10 years of experience. Graduated from Harvard Dental School.",
      phone: "+1 (555) 123-4567",
      email: "dr.abreham@hospital.com",
      availability: "Mon-Fri: 9AM-5PM",
      experience: "10 years"
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      image: drSarah,
      bio: "Board-certified cardiologist specializing in interventional procedures. Former chief resident at Johns Hopkins Hospital.",
      phone: "+1 (555) 234-5678",
      email: "dr.johnson@hospital.com",
      availability: "Mon-Wed, Fri: 8AM-4PM",
      experience: "12 years"
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      image: drMichael,
      bio: "Expert in treating complex neurological disorders. Published researcher in neurodegenerative diseases.",
      phone: "+1 (555) 345-6789",
      email: "dr.chen@hospital.com",
      availability: "Tue-Thu: 10AM-6PM",
      experience: "8 years"
    },
    {
      id: 4,
      name: "Dr. Emily Wilson",
      specialty: "Pediatrician",
      image: drEmily,
      bio: "Caring pediatrician with special interest in childhood immunology. Fluent in English, Spanish, and French.",
      phone: "+1 (555) 456-7890",
      email: "dr.wilson@hospital.com",
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
            Our Doctors
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
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Book
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
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative pb-48 overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="absolute h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <FaUserMd className="text-blue-500 mr-2" />
                      <h3 className="text-xl font-bold text-gray-900">
                        {doctor.name}
                      </h3>
                    </div>
                    <div className="flex items-center mb-4">
                      <FaClinicMedical className="text-gray-500 mr-2" />
                      <p className="text-gray-600 font-medium">
                        {doctor.specialty}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                      {doctor.bio}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaPhone className="mr-2" />
                        {doctor.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaEnvelope className="mr-2" />
                        {doctor.email}
                      </div>
                    </div>
                    <button className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={toggleView}
                className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                View all doctors
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OurDoctors;