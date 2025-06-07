import React, { useState } from 'react';
import { FaHospital, FaUser, FaCalendarAlt, FaEnvelope, FaUserMd, FaClock, FaPhone } from 'react-icons/fa';

const AddAppointment = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    department: '',
    doctorName: '',
    date: '',
    time: ''
  });

  const departments = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dentistry'
  ];

  const doctors = {
    'Cardiology': ['Dr. Sarah Johnson (Cardiologist)'],
    'Dermatology': ['Dr. James Wilson (Dermatologist)'],
    'Neurology': ['Dr. Michael Chen (Neurologist)'],
    'Pediatrics': ['Dr. Emily Wilson (Pediatrician)'],
    'Orthopedics': ['Dr. Robert Brown (Orthopedist)'],
    'Dentistry': ['Dr. Abreham (Dentist)']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset doctor when department changes
      ...(name === 'department' && { doctorName: '' })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Appointment created:', formData);
    alert('Appointment created successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with Hospital Icon */}
        <div className="bg-blue-600 p-6 flex items-center justify-center">
          <FaHospital className="text-white text-4xl mr-4" />
          <h1 className="text-3xl font-bold text-white">Add New Appointment</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Patient Information Column */}
            <div className="space-y-6">
              <div className="flex items-center mb-2">
                <FaUser className="text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="patientPhone"
                    value={formData.patientPhone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <FaPhone className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="patientEmail"
                    value={formData.patientEmail}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Appointment Details Column */}
            <div className="space-y-6">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Appointment Details</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <FaHospital className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <div className="relative">
                  <select
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    disabled={!formData.department}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:bg-gray-100"
                    required
                  >
                    <option value="">{formData.department ? 'Select Doctor' : 'Select department first'}</option>
                    {formData.department && doctors[formData.department]?.map((doctor, index) => (
                      <option key={index} value={doctor}>{doctor}</option>
                    ))}
                  </select>
                  <FaUserMd className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <FaClock className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;