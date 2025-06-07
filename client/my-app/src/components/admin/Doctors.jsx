import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaThLarge,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheck,
  FaEllipsisV,
  FaTimes as FaClose,
  FaCamera,
} from "react-icons/fa";
import { Menu } from "@headlessui/react";

const Doctors = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
  });
  const [doctorName, setDoctorName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    doctorfullname: "",
    email: "",
    department: "",
    contact: "",
    experiance: "",
    pwd: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/admin/getAllDoctors"
        );
        if (!response.ok) throw new Error("Failed to fetch doctor data");

        const data = await response.json();
        const doctorsData = Array.isArray(data) ? data : data.doctors || [];

        // Format doctor IDs and ensure photo_url exists
        const formattedDoctors = doctorsData.map((doctor, index) => ({
          ...doctor,
          doctor_id: `D${String(index + 1).padStart(3, "0")}`,
          photo_url: doctor.photo_url || null,
        }));

        setDoctors(formattedDoctors);
        setFilteredDoctors(formattedDoctors);
        setStats((prev) => ({
          ...prev,
          totalDoctors: formattedDoctors.length,
        }));
      } catch (err) {
        setError(err.message || "Failed to fetch doctors data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Live search functionality
  useEffect(() => {
    if (!doctorName.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    const filtered = doctors.filter((d) =>
      d.doctorfullname.toLowerCase().includes(doctorName.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctorName, doctors]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/admin/doctors/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Failed to delete doctor");

        const updated = filteredDoctors.filter((d) => d.id !== id);
        setFilteredDoctors(updated);
        setDoctors(updated);
        setStats((prev) => ({ ...prev, totalDoctors: prev.totalDoctors - 1 }));
      } catch (err) {
        setError(err.message || "Failed to delete doctor");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);
    setEditFormData({
      doctorfullname: doctor.doctorfullname,
      email: doctor.email,
      department: doctor.department,
      contact: doctor.contact,
      experiance: doctor.experiance,
      pwd: doctor.pwd || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/admin/doctors/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorfullname: editFormData.doctor_name,
            email: editFormData.email_id,
            department: editFormData.department,
            contact: editFormData.contact,
            experiance: editFormData.experiance,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update doctor");
      }

      const updatedDoctors = filteredDoctors.map((d) =>
        d.id === id
          ? {
              ...d,
              doctorfullname: editFormData.doctor_name,
              email: editFormData.email_id,
              department: editFormData.department,
              contact: editFormData.contact,
              experiance: editFormData.experiance,
            }
          : d
      );

      setFilteredDoctors(updatedDoctors);
      setDoctors(updatedDoctors);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden text-black">
      {/* Mobile Header */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        <div>
          <h2 className="flex items-center mb-6 p-4 font-bold text-gray-700 text-lg">
            <FaUserCircle className="mr-3 text-blue-500 text-4xl" /> Admin
          </h2>
          <nav className="space-y-2">
            <Link
              to="/AdminDashboard"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md"
            >
              <FaThLarge size={20} /> <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/getAllDoctors"
              className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md font-semibold"
            >
              <FaUserMd size={20} /> <span>Doctors</span>
            </Link>
            <Link
              to="/Departments"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md"
            >
              <FaUsers size={20} /> <span>Departments</span>
            </Link>
            <Link
              to="/Appointments"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md"
            >
              <FaCalendarCheck size={20} /> <span>Appointments</span>
            </Link>
            <Link
              to="/admin/doctors"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md"
            >
              <FaUserMd size={20} /> <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link
          to="/"
          className="flex items-center space-x-2 hover:bg-red-50 p-2 rounded-md text-red-500"
        >
          <FaSignOutAlt size={20} /> <span>Log out</span>
        </Link>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden z-10 fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          {/* Search and Add Doctor */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="flex-1 w-full sm:w-auto mb-4 sm:mb-0">
              <label htmlFor="search-doctor" className="sr-only">
                Search Doctors
              </label>
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  id="search-doctor"
                  className="py-2 pl-10 pr-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search doctors..."
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
                {doctorName && (
                  <button
                    onClick={() => setDoctorName("")}
                    className="absolute right-3 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="sm:ml-4 flex-shrink-0 w-full sm:w-auto">
              <Link
                to="/admin/doctors"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center space-x-2 w-full"
              >
                <FaUserMd />
                <span>Add New Doctor</span>
              </Link>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 mb-4 px-4 py-3 border border-red-400 rounded text-red-700">
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="py-4 text-center">
              <div className="inline-block border-t-2 border-b-2 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
            </div>
          )}

          {/* Doctors table */}
          <DoctorTable
            doctors={filteredDoctors}
            editingId={editingId}
            editFormData={editFormData}
            handleEditChange={handleEditChange}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
          />
        </div>
      </main>
    </div>
  );
};

const DoctorTable = ({
  doctors = [],
  editingId,
  editFormData,
  handleEditChange,
  handleEdit,
  handleDelete,
  handleSaveEdit,
  handleCancelEdit,
}) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <div className="relative">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="border border-gray-300 w-full border-collapse">
            <thead className="top-0 z-10 sticky bg-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Photo
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    No doctors found
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex justify-center">
                        {doctor.photo_url ? (
                          <img
                            src={doctor.photo_url}
                            alt={doctor.doctorfullname}
                            className="rounded-full w-10 h-10 object-cover"
                          />
                        ) : (
                          <div className="flex justify-center items-center bg-gray-200 rounded-full w-10 h-10">
                            <FaUserCircle className="text-gray-400 text-xl" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 text-sm">
                        {doctor.doctor_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === doctor.id ? (
                        <input
                          name="doctor_name"
                          value={editFormData.doctor_name}
                          onChange={handleEditChange}
                          className="px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        <div>
                          Dr.{doctor.doctorfullname}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === doctor.id ? (
                        <input
                          name="email_id"
                          value={editFormData.email_id}
                          onChange={handleEditChange}
                          className="px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        doctor.email
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === doctor.id ? (
                        <select
                          name="department"
                          value={editFormData.department}
                          onChange={handleEditChange}
                          className="px-2 py-1 border rounded w-full"
                        >
                          <option value="Cardiology">Cardiology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Orthopedics">Orthopedics</option>
                        </select>
                      ) : (
                        doctor.department
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === doctor.id ? (
                        <input
                          name="contact"
                          value={editFormData.contact}
                          onChange={handleEditChange}
                          className="px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        doctor.contact
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === doctor.id ? (
                        <input
                          type="number"
                          name="experiance"
                          value={editFormData.experiance}
                          onChange={handleEditChange}
                          className="px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        `${doctor.experiance} years`
                      )}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {editingId === doctor.id ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleSaveEdit(doctor.id)}
                            className="text-green-500 hover:text-green-700"
                            title="Save"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-500 hover:text-red-700"
                            title="Cancel"
                          >
                            <FaClose />
                          </button>
                        </div>
                      ) : (
                        <Menu
                          as="div"
                          className="inline-block relative text-left"
                        >
                          <Menu.Button className="text-gray-700 hover:text-gray-900">
                            <FaEllipsisV />
                          </Menu.Button>
                          <Menu.Items className="right-0 z-10 absolute bg-white shadow-md mt-2 border border-gray-200 rounded-md w-28">
                            <div className="p-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleEdit(doctor)}
                                    className={`flex items-center w-full px-2 py-1 text-sm ${
                                      active ? "bg-gray-100" : ""
                                    }`}
                                  >
                                    <FaEdit className="mr-2" /> Edit
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleDelete(doctor.id)}
                                    className={`flex items-center w-full px-2 py-1 text-sm text-red-500 ${
                                      active ? "bg-red-50" : ""
                                    }`}
                                  >
                                    <FaTrash className="mr-2" /> Delete
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Menu>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
