import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaUserMd, FaPrescriptionBottle, FaNotesMedical, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminPatientHistory = ({ patientId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientInfo, setPatientInfo] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (!patientId) {
                    toast.error('Patient ID is required');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/appointments/admin/patient/${patientId}/history`);
                if (response.data.success) {
                    setHistory(response.data.history);
                    // Get patient info from the first record
                    if (response.data.history.length > 0) {
                        setPatientInfo({
                            name: response.data.history[0].patient_name,
                            phone: response.data.history[0].patient_phone,
                            email: response.data.history[0].patient_email,
                            address: response.data.history[0].patient_address,
                            gender: response.data.history[0].patient_gender,
                            age: response.data.history[0].patient_age
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching history:', error);
                toast.error('Failed to fetch patient history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {patientInfo && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center">
                            <FaUser className="text-blue-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="font-semibold">{patientInfo.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaPhone className="text-green-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-semibold">{patientInfo.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaEnvelope className="text-purple-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold">{patientInfo.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="text-red-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-600">Address</p>
                                <p className="font-semibold">{patientInfo.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaUser className="text-indigo-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-600">Gender</p>
                                <p className="font-semibold">{patientInfo.gender}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaUser className="text-pink-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-600">Age</p>
                                <p className="font-semibold">{patientInfo.age} years</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment History</h2>
            
            {history.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No appointment history found for this patient.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {history.map((record) => (
                        <div key={record.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-4">
                                <FaCalendarAlt className="text-blue-500 mr-2" />
                                <div>
                                    <p className="text-sm text-gray-600">Appointment Date</p>
                                    <p className="font-semibold">
                                        {new Date(record.appointment_date).toLocaleDateString()} at {record.appointment_time}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center mb-4">
                                <FaUserMd className="text-green-500 mr-2" />
                                <div>
                                    <p className="text-sm text-gray-600">Doctor</p>
                                    <p className="font-semibold">{record.doctor_name}</p>
                                    <p className="text-sm text-gray-500">{record.department}</p>
                                </div>
                            </div>

                            {record.diagnosis && (
                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <FaNotesMedical className="text-red-500 mr-2" />
                                        <p className="font-semibold">Diagnosis</p>
                                    </div>
                                    <p className="text-gray-600">{record.diagnosis}</p>
                                </div>
                            )}

                            {record.prescription && (
                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <FaPrescriptionBottle className="text-purple-500 mr-2" />
                                        <p className="font-semibold">Prescription</p>
                                    </div>
                                    <p className="text-gray-600">{record.prescription}</p>
                                </div>
                            )}

                            {record.medicine_name && (
                                <div className="bg-gray-50 rounded p-3 mb-4">
                                    <p className="font-semibold mb-2">Medication Details</p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li><span className="font-medium">Medicine:</span> {record.medicine_name}</li>
                                        <li><span className="font-medium">Dosage:</span> {record.medicine_dosage}</li>
                                        <li><span className="font-medium">Frequency:</span> {record.medicine_frequency}</li>
                                        <li><span className="font-medium">Duration:</span> {record.medicine_duration}</li>
                                    </ul>
                                </div>
                            )}

                            {record.next_appointment_date && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">Next Appointment</p>
                                    <p className="font-semibold">
                                        {new Date(record.next_appointment_date).toLocaleDateString()} at {record.next_appointment_time}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaClock className="mr-2" />
                                    <span>Recorded on: {new Date(record.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPatientHistory; 