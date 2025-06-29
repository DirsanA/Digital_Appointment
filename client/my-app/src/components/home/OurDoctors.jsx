import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaPhone,
  FaEnvelope,
  FaClinicMedical,
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// Import your local images (adjust paths as needed)
// import drAbreham from "/assets/doc2.jpg";
// import drSarah from "/assets/doc2.jpg";
// import drMichael from "/assets/doc4.jpg";
// import drEmily from "/assets/doc8.jpg";

const OurDoctors = () => {
  const [showTableView, setShowTableView] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/getAllDoctors"
        );
        let doctorsData = [];
        if (Array.isArray(response.data)) {
          doctorsData = response.data;
        } else if (response.data && Array.isArray(response.data.doctors)) {
          doctorsData = response.data.doctors;
        } else {
          console.warn("Unexpected API response format:", response.data);
        }

        if (doctorsData.length > 0) {
          // Format doctor IDs and ensure photo_url exists
          const formattedDoctors = doctorsData.map((doctor, index) => ({
            id: doctor._id || index, // Use _id if available, otherwise index
            name: doctor.doctorfullname,
            specialty: doctor.department,
            image: doctor.photo_url || null,
            bio: doctor.bio || "We are here to care you.",
            phone: doctor.contact,
            email: doctor.email,
            availability: doctor.availability || "6:00 AM - 6:00 PM",
            experience: doctor.experiance + " years of experience",
          }));
          setDoctors(formattedDoctors);
        } else {
          setDoctors([]); // Set to empty array if no data
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to load doctors. Please try again later.");
        setDoctors([]); // Ensure doctors array is empty on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const toggleView = () => setShowTableView(!showTableView);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <p>No doctors found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="font-extrabold text-gray-900 text-3xl sm:text-4xl">
            Our Expert Doctors
          </h1>
          <div className="bg-blue-600 mx-auto mt-4 w-20 h-1"></div>
          <p className="mx-auto mt-6 max-w-2xl text-gray-600 text-xl">
            Meet our team of highly qualified and compassionate healthcare
            professionals
          </p>
        </div>

        {showTableView ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-gray-800 text-xl">All Doctors</h2>
              <button
                onClick={toggleView}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" /> Back to cards
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="divide-y divide-gray-200 min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                      Specialty
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.image ? (
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="rounded-full w-12 h-12 object-cover"
                          />
                        ) : (
                          <div className="flex justify-center items-center bg-gray-200 rounded-full w-12 h-12">
                            <FaUserCircle className="text-gray-400 text-2xl" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {doctor.name}
                        </div>
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
                            <FaEnvelope className="mr-1 text-sm" />{" "}
                            {doctor.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {doctor.availability}
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {doctor.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                          onClick={() => navigate("/patient-login")}
                        >
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
           <div className="overflow-x-auto pb-4">
  <div className="flex flex-nowrap gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
    {doctors.slice(0, 4).map((doctor) => (
      <div
        key={doctor.id}
        className="flex-shrink-0 w-[300px] sm:w-full bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      >
        {/* Image Section - Improved with proper aspect ratio */}
        <div className="relative h-64 w-full overflow-hidden">
          {doctor.image ? (
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center">
              <FaUserCircle className="text-blue-300 text-7xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="font-bold text-white text-xl">{doctor.name}</h3>
            <p className="font-medium text-blue-200">{doctor.specialty}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Experience Badge */}
          <div className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm font-medium text-blue-800">
            {doctor.experience} experience
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm line-clamp-3">
            {doctor.bio || "No biography available"}
          </p>

          {/* Doctor Info */}
          <div className="space-y-3">
            <div className="flex items-start text-gray-600 text-sm">
              <FaClock className="mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
              <span>{doctor.availability || "Not specified"}</span>
            </div>
            <div className="flex items-start text-gray-600 text-sm">
              <FaPhone className="mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
              <span>{doctor.phone || "Not provided"}</span>
            </div>
            <div className="flex items-start text-gray-600 text-sm">
              <FaEnvelope className="mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
              <span className="truncate">{doctor.email || "Not provided"}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors duration-200"
            onClick={() => navigate("/patient-login")}
          >
            <FaCalendarAlt className="mr-2" />
            Book Appointment
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

            <div className="mt-12 text-center">
              <button
                onClick={toggleView}
                className="flex items-center hover:bg-blue-50 mx-auto px-6 py-3 border border-blue-600 rounded-md font-medium text-blue-600 transition-colors"
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
