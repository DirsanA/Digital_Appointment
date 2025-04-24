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
    doctor_name: "",
    email_id: "",
    department: "",
    contact: "",
    experiance: "",
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
        // Handle both array and object response formats
        const doctorsData = Array.isArray(data) ? data : data.doctors || [];

        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        setStats((prev) => ({ ...prev, totalDoctors: doctorsData.length }));
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
    const filtered = doctors.filter((d) =>
      d.doctor_name.toLowerCase().includes(doctorName.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

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
        setStats((prev) => ({ ...prev, totalDoctors: prev.totalDoctors - 1 }));
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
      doctor_name: doctor.doctorfullname,
      email_id: doctor.email,
      department: doctor.department,
      contact: doctor.contact,
      experiance: doctor.experiance,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      doctor_name: "",
      email_id: "",
      department: "",
      contact: "",
      experiance: "",
    });
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
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update doctor");
      }

      const updatedDoctors = filteredDoctors.map((d) =>
        d.id === id ? { ...d, ...editFormData } : d
      );
      setFilteredDoctors(updatedDoctors);
      setEditingId(null);
      setEditFormData({
        doctor_name: "",
        email_id: "",
        department: "",
        contact: "",
        experiance: "",
      });
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden text-black">
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

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
          to="/logout"
          className="flex items-center space-x-2 hover:bg-red-50 p-2 rounded-md text-red-500"
        >
          <FaSignOutAlt size={20} /> <span>Log out</span>
        </Link>
      </aside>

      {sidebarOpen && (
        <div
          className="md:hidden z-10 fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-8">
            <StatCard
              icon={<FaUsers size={32} className="text-blue-500" />}
              label="Total Patients"
              value={stats.totalPatients}
            />
            <StatCard
              icon={<FaUserMd size={32} className="text-green-500" />}
              label="Total Doctors"
              value={stats.totalDoctors}
            />
            <StatCard
              icon={<FaCalendarCheck size={32} className="text-purple-500" />}
              label="Total Appointments"
              value={stats.totalAppointments}
            />
          </div>

          <form
            onSubmit={handleSearch}
            className="flex bg-white shadow-md mb-6 p-4 rounded-lg"
          >
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Doctor's name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="flex items-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg text-white"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </form>

          {error && (
            <div className="bg-red-100 mb-4 px-4 py-3 border border-red-400 rounded text-red-700">
              {error}
            </div>
          )}
          {isLoading && (
            <div className="py-4 text-center">
              <div className="inline-block border-t-2 border-b-2 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
            </div>
          )}

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

const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
    {icon}
    <div className="ml-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-bold text-2xl">{value}</p>
    </div>
  </div>
);

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
      <div className="overflow-x-auto">
        {doctors.length === 0 ? (
          <p className="py-4 text-center">No doctors found</p>
        ) : (
          <table className="border border-gray-300 w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Photo</th>
                <th className="p-2 border">Doctor Name</th>
                <th className="p-2 border">Password</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Experience</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-100">
                  <td className="p-2 border text-center">
                    {doctor.photo ? (
                      <img
                        src={doctor.photo}
                        alt="Doctor"
                        className="mx-auto rounded-full w-12 h-12 object-cover"
                      />
                    ) : (
                      <div className="flex justify-center items-center bg-gray-300 mx-auto rounded-full w-12 h-12 text-white">
                        N/A
                      </div>
                    )}
                  </td>

                  {/* ✅ doctorfullname fix */}
                  <td className="p-2 border">
                    {editingId === doctor.id ? (
                      <input
                        name="doctorfullname"
                        value={editFormData.doctorfullname}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded w-full"
                      />
                    ) : (
                      doctor.doctorfullname
                    )}
                  </td>

                  <td className="p-2 border">••••••</td>

                  {/* ✅ email fix */}
                  <td className="p-2 border">
                    {editingId === doctor.id ? (
                      <input
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded w-full"
                      />
                    ) : (
                      doctor.email
                    )}
                  </td>

                  <td className="p-2 border">
                    {editingId === doctor.id ? (
                      <input
                        name="department"
                        value={editFormData.department}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded w-full"
                      />
                    ) : (
                      doctor.department
                    )}
                  </td>

                  <td className="p-2 border">
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

                  <td className="p-2 border">
                    {editingId === doctor.id ? (
                      <input
                        name="experiance"
                        value={editFormData.experiance}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded w-full"
                      />
                    ) : (
                      doctor.experiance
                    )}
                  </td>

                  <td className="p-2 border text-center">
                    {editingId === doctor.id ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleSaveEdit(doctor.id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-500 hover:text-red-700"
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Doctors;
