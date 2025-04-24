import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle, FaUserMd, FaUsers, FaCalendarCheck,
  FaThLarge, FaSignOutAlt, FaBars, FaTimes, FaSearch,
  FaEdit, FaTrash, FaCheck,FaEllipsisV, FaTimes as FaClose
} from "react-icons/fa";
import drAbreham from './assets/doc9.jpg';
import drEmily from './assets/doc8.jpg';
import { Menu } from "@headlessui/react";


// Sample JSON data
const sampleData = {
  stats: {
    totalPatients: 0,
    totalDoctors: 2,
    totalAppointments: 0
  },
  doctors: [
    {
      id: 1,
      name: "Dr. Dirsan Antehun",
      email: "dirsan@gmail.com",
      department: "Cardiology",
      contact: "0916783478",
      photo: drAbreham,
      experience: "8 years"
    },
    {
      id: 2,
      name: "Dr. Desu Mulat",
      email: "desu@gmail.com",
      department: "Neurology",
      contact: "0907412708",
      photo: drEmily,
      experience: "6 years"
    }
  ]
};

const Doctors = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0
  });
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    department: "",
    contact: "",
    experience: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate fetching data from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from your API endpoint
        // const response = await fetch('your-api-endpoint/doctors');
        // const data = await response.json();
        
        // For demo purposes, we're using the sample data
        setStats(sampleData.stats);
        setDoctors(sampleData.doctors);
      } catch (err) {
        setError("Failed to fetch doctors data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredDoctors = sampleData.doctors.filter(doctor =>
      doctor.email.toLowerCase().includes(email.toLowerCase())
    );
    setDoctors(filteredDoctors);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      setIsLoading(true);
      try {
        // In a real app, you would call your API to delete
        // await fetch(`your-api-endpoint/doctors/${id}`, { method: 'DELETE' });
        
        // For demo, we'll filter out the deleted doctor
        const updatedDoctors = doctors.filter(doctor => doctor.id !== id);
        setDoctors(updatedDoctors);
        setStats(prev => ({ ...prev, totalDoctors: prev.totalDoctors - 1 }));
      } catch (err) {
        setError("Failed to delete doctor");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);
    setEditFormData({
      name: doctor.name,
      department: doctor.department,
      contact: doctor.contact,
      experience: doctor.experience
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id) => {
    setIsLoading(true);
    try {
      // In a real app, you would call your API to update
      // await fetch(`your-api-endpoint/doctors/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editFormData)
      // });
      
      // For demo, we'll update the local state
      const updatedDoctors = doctors.map(doctor => 
        doctor.id === id ? { ...doctor, ...editFormData } : doctor
      );
      setDoctors(updatedDoctors);
      setEditingId(null);
    } catch (err) {
      setError("Failed to update doctor");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-black">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10 flex justify-end text-black">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-black"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:right-0 md:translate-x-0 md:w-1/4`}>
        <div className="overflow-y-auto">
          <h2 className="text-lg font-bold mb-6 flex items-center p-4 text-gray-700">
            <FaUserCircle className="text-blue-500 text-4xl mr-3" /> Admin
          </h2>
          <nav className="space-y-2 text-black">
            <Link to="/AdminDashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
              <FaThLarge size={20} /> <span>Dashboard</span>
            </Link>
            <Link to="/Doctors" className="flex items-center space-x-2 p-2 bg-gray-200 rounded-md font-semibold">
              <FaUserMd size={20} /> <span>Doctors</span>
            </Link>
            <Link to="/Departments" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
              <FaUsers size={20} /> <span>Departments</span>
            </Link>
            <Link to="/Appointments" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
              <FaCalendarCheck size={20} /> <span>Appointments</span>
            </Link>
            <Link to="/AddDoctors" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md">
              <FaUserMd size={20} /> <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link to="/logout" className="flex items-center space-x-2 p-2 text-red-500 hover:bg-red-50 rounded-md">
          <FaSignOutAlt size={20} /> <span>Log out</span>
        </Link>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaUsers size={32} className="text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold">{stats.totalPatients}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaUserMd size={32} className="text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Doctors</p>
                <p className="text-2xl font-bold">{stats.totalDoctors}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaCalendarCheck size={32} className="text-purple-500 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-bold">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Doctor's email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 flex items-center"
              >
                <FaSearch className="mr-2" /> Search
              </button>
            </form>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Doctor Table */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Photo</th>
                    <th className="border p-2">Doctor Name</th>
                    <th className="border p-2">Password</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Department</th>
                    <th className="border p-2">Contact</th>
                    <th className="border p-2">Experience</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="text-center border-t">
                      <td className="border p-2">
                        <img
                          src={doctor.photo || "https://via.placeholder.com/50"}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-full mx-auto"
                        />
                      </td>
                      <td className="border p-2">
                        {editingId === doctor.id ? (
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          doctor.name
                        )}
                      </td>
                      <td className="border p-2">••••••••</td>
                      <td className="border p-2">{doctor.email}</td>
                      <td className="border p-2">
                        {editingId === doctor.id ? (
                          <input
                            type="text"
                            name="department"
                            value={editFormData.department}
                            onChange={handleEditChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          doctor.department
                        )}
                      </td>
                      <td className="border p-2">
                        {editingId === doctor.id ? (
                          <input
                            type="text"
                            name="contact"
                            value={editFormData.contact}
                            onChange={handleEditChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          doctor.contact
                        )}
                      </td>
                      <td className="border p-2">
                        {editingId === doctor.id ? (
                          <input
                            type="text"
                            name="experience"
                            value={editFormData.experience}
                            onChange={handleEditChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          doctor.experience
                        )}
                      </td>
                      <td className="border p-2 relative">
                    <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="p-2 text-gray-600 hover:text-black">
                            <FaEllipsisV />
                                  </Menu.Button>

                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                     <div className="p-1 text-sm text-gray-700">
                                   {editingId === doctor.id ? (
                                      <>
                                     <Menu.Item>
                             {({ active }) => (
                          <button
                  onClick={() => handleSaveEdit(doctor.id)}
                  className={`${
                    active ? "bg-green-100" : ""
                  } flex items-center w-full px-2 py-1 text-green-600 hover:bg-green-50`}
                >
                  <FaCheck className="mr-2" /> Save
                </button>
              )}
                     </Menu.Item>
                            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleCancelEdit}
                  className={`${
                    active ? "bg-gray-100" : ""
                  } flex items-center w-full px-2 py-1 text-gray-600 hover:bg-gray-50`}
                >
                  <FaClose className="mr-2" /> Cancel
                </button>
              )}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleEdit(doctor)}
                  className={`${
                    active ? "bg-blue-100" : ""
                  } flex items-center w-full px-2 py-1 text-blue-600 hover:bg-blue-50`}
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className={`${
                    active ? "bg-red-100" : ""
                  } flex items-center w-full px-2 py-1 text-red-600 hover:bg-red-50`}
                >
                  <FaTrash className="mr-2" /> <Delate></Delate>
                </button>
              )}
            </Menu.Item>
                       </>
                           )}
                       </div>
                 </Menu.Items>
                </Menu>
                    </td>


                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Doctors;