// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaCalendarAlt, FaUserMd, FaPrescriptionBottle, FaNotesMedical, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
// import { toast } from 'react-toastify';

// const AdminPatientHistory = ({ patientId }) => {
//     const [history, setHistory] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [patientInfo, setPatientInfo] = useState(null);

//     useEffect(() => {
//         const fetchHistory = async () => {
//             try {
//                 if (!patientId) {
//                     toast.error('Patient ID is required');
//                     return;
//                 }

//                 const response = await axios.get(`http://localhost:5000/api/appointments/admin/patient/${patientId}/history`);
//                 if (response.data.success) {
//                     setHistory(response.data.history);
//                     // Get patient info from the first record
//                     if (response.data.history.length > 0) {
//                         setPatientInfo({
//                             name: response.data.history[0].patient_name,
//                             phone: response.data.history[0].patient_phone,
//                             email: response.data.history[0].patient_email,
//                             address: response.data.history[0].patient_address,
//                             gender: response.data.history[0].patient_gender,
//                             age: response.data.history[0].patient_age
//                         });
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching history:', error);
//                 toast.error('Failed to fetch patient history');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchHistory();
//     }, [patientId]);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <div className="border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="mx-auto px-4 py-8 container">
//             {patientInfo && (
//                 <div className="bg-white shadow-md mb-8 p-6 rounded-lg">
//                     <h2 className="mb-4 font-bold text-gray-800 text-2xl">Patient Information</h2>
//                     <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//                         <div className="flex items-center">
//                             <FaUser className="mr-2 text-blue-500" />
//                             <div>
//                                 <p className="text-gray-600 text-sm">Name</p>
//                                 <p className="font-semibold">{patientInfo.name}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center">
//                             <FaPhone className="mr-2 text-green-500" />
//                             <div>
//                                 <p className="text-gray-600 text-sm">Phone</p>
//                                 <p className="font-semibold">{patientInfo.phone}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center">
//                             <FaEnvelope className="mr-2 text-purple-500" />
//                             <div>
//                                 <p className="text-gray-600 text-sm">Email</p>
//                                 <p className="font-semibold">{patientInfo.email}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center">
//                             <FaMapMarkerAlt className="mr-2 text-red-500" />
//                             <div>
//                                 <p className="text-gray-600 text-sm">Address</p>
//                                 <p className="font-semibold">{patientInfo.address}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center">
//                             <FaUser className="mr-2 text-indigo-500" />
//                             <div>
//                                 <p className="text-gray-600 text-sm">Gender</p>
//                                 <p className="font-semibold">{patientInfo.gender}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center">
//                             <FaUser className="mr-2 text-pink-500" />
//                             <div>
//                                 <p className="text-gray-600 text-sm">Age</p>
//                                 <p className="font-semibold">{patientInfo.age} years</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <h2 className="mb-6 font-bold text-gray-800 text-2xl">Appointment History</h2>

//             {history.length === 0 ? (
//                 <div className="py-8 text-center">
//                     <p className="text-gray-500">No appointment history found for this patient.</p>
//                 </div>
//             ) : (
//                 <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
//                     {history.map((record) => (
//                         <div key={record.id} className="bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-shadow">
//                             <div className="flex items-center mb-4">
//                                 <FaCalendarAlt className="mr-2 text-blue-500" />
//                                 <div>
//                                     <p className="text-gray-600 text-sm">Appointment Date</p>
//                                     <p className="font-semibold">
//                                         {new Date(record.appointment_date).toLocaleDateString()} at {record.appointment_time}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="flex items-center mb-4">
//                                 <FaUserMd className="mr-2 text-green-500" />
//                                 <div>
//                                     <p className="text-gray-600 text-sm">Doctor</p>
//                                     <p className="font-semibold">{record.doctor_name}</p>
//                                     <p className="text-gray-500 text-sm">{record.department}</p>
//                                 </div>
//                             </div>

//                             {record.diagnosis && (
//                                 <div className="mb-4">
//                                     <div className="flex items-center mb-2">
//                                         <FaNotesMedical className="mr-2 text-red-500" />
//                                         <p className="font-semibold">Diagnosis</p>
//                                     </div>
//                                     <p className="text-gray-600">{record.diagnosis}</p>
//                                 </div>
//                             )}

//                             {record.prescription && (
//                                 <div className="mb-4">
//                                     <div className="flex items-center mb-2">
//                                         <FaPrescriptionBottle className="mr-2 text-purple-500" />
//                                         <p className="font-semibold">Prescription</p>
//                                     </div>
//                                     <p className="text-gray-600">{record.prescription}</p>
//                                 </div>
//                             )}

//                             {record.medicine_name && (
//                                 <div className="bg-gray-50 mb-4 p-3 rounded">
//                                     <p className="mb-2 font-semibold">Medication Details</p>
//                                     <ul className="space-y-1 text-gray-600 text-sm">
//                                         <li><span className="font-medium">Medicine:</span> {record.medicine_name}</li>
//                                         <li><span className="font-medium">Dosage:</span> {record.medicine_dosage}</li>
//                                         <li><span className="font-medium">Frequency:</span> {record.medicine_frequency}</li>
//                                         <li><span className="font-medium">Duration:</span> {record.medicine_duration}</li>
//                                     </ul>
//                                 </div>
//                             )}

//                             {record.next_appointment_date && (
//                                 <div className="mt-4 pt-4 border-gray-200 border-t">
//                                     <p className="text-gray-600 text-sm">Next Appointment</p>
//                                     <p className="font-semibold">
//                                         {new Date(record.next_appointment_date).toLocaleDateString()} at {record.next_appointment_time}
//                                     </p>
//                                 </div>
//                             )}

//                             <div className="mt-4 pt-4 border-gray-200 border-t">
//                                 <div className="flex items-center text-gray-500 text-sm">
//                                     <FaClock className="mr-2" />
//                                     <span>Recorded on: {new Date(record.created_at).toLocaleString()}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminPatientHistory;
