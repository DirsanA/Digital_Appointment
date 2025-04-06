import React, { useState } from 'react';

const AboutUs = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 md:py-48 ">
        <div className="text-center mb-12 fixed justify-center items-center top-10 left-0 right-0 z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About us</h1>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
              Pioneering Healthcare Excellence Since 1995
            </h2>
            
            <p className="text-lg text-gray-100 mb-8 leading-relaxed">
              At D² Hospital, we combine cutting-edge medical technology with compassionate care to deliver exceptional healthcare services. Our team of 200+ specialists across 30 departments is committed to your well-being.
            </p>

            <p className="text-lg text-gray-100 mb-8 leading-relaxed">
              We've been recognized as a Top 100 Hospital for 5 consecutive years, with patient satisfaction scores consistently above 98%. Our innovative management practices ensure efficient, personalized care for every patient.
            </p>
            
            <div className="relative inline-block group">
  <button 
    onClick={() => setShowModal(true)}
    className="relative px-8 py-3 bg-white text-blue-600 font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:text-white"
  >
    Learn more
  </button>
</div>

          </div>
        </div>
        
        {/* Horizontal divider */}
        <div className="max-w-4xl mx-auto border-t border-white border-opacity-30 my-12"></div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Our Commitment to Excellence</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-gray-700">
                <p>
                D² General Hospital was founded in 1995 with a vision to revolutionize healthcare delivery in our region. Today, we serve over 50,000 patients annually with our comprehensive services.
                </p>

                <h4 className="font-semibold text-lg mt-6 text-blue-600">Our Specialties Include:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Cardiology and Cardiac Surgery</li>
                  <li>Oncology and Cancer Care</li>
                  <li>Neurology and Neurosurgery</li>
                  <li>Pediatrics and Neonatal Care</li>
                  <li>Orthopedics and Sports Medicine</li>
                </ul>

                <h4 className="font-semibold text-lg mt-6 text-blue-600">Quality Accreditations:</h4>
                <p>
                  We are proud to be accredited by the Joint Commission International (JCI) and maintain certifications in numerous specialty areas. Our infection control standards exceed national averages by 40%.
                </p>

                <h4 className="font-semibold text-lg mt-6 text-blue-600">Community Outreach:</h4>
                <p>
                  Each year, we provide over $2 million in charitable care and conduct 150+ free health screenings in underserved communities. Our mobile health units reach patients in rural areas with limited access to care.
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;