import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaTimes,
  FaBuilding,
} from "react-icons/fa";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const Departments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDepartments = async (search = "") => {
    try {
      setLoading(true);
      setError(null);

      const url = search
        ? `http://localhost:5000/admin/getAllDepartments?search=${encodeURIComponent(
          search
        )}`
        : "http://localhost:5000/admin/getAllDepartments";

      const response = await axios.get(url);
      const responseData = response.data;
      const departmentsData = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.departments)
          ? responseData.departments
          : [];

      setDepartments(departmentsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load departments data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDepartments(searchTerm);
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) return;

    try {
      setActionLoading(true);
      await axios.post("http://localhost:5000/admin/addDepartment", {
        name: newDepartmentName.trim(),
      });
      setNewDepartmentName("");
      setShowAddModal(false);
      fetchDepartments(searchTerm);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add department");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the department "${name}"?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await axios.delete(`http://localhost:5000/admin/deleteDepartment/${id}`);
      fetchDepartments(searchTerm);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete department");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && departments.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden text-black">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaBuilding className="text-blue-600" /> Hospital Departments
            </h1>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex flex-1 md:flex-initial">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search departments..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (!e.target.value.trim()) {
                        fetchDepartments("");
                      }
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                </div>
              </form>

              {/* Add Department Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-all"
              >
                <FaPlus /> Add Department
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Departments Table */}
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="border w-full text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-xs">
                  <th className="p-3 border">Department ID</th>
                  <th className="p-3 border">Department Name</th>
                  <th className="p-3 border text-center">Number Of Doctors</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departments.length > 0 ? (
                  departments.map((dept) => {
                    const deptName = dept.department_name || dept.name;
                    return (
                      <tr key={dept.id} className="hover:bg-gray-50 transition">
                        <td className="p-3 border font-medium text-gray-700">
                          #{dept.id}
                        </td>
                        <td className="p-3 border font-semibold text-gray-800">
                          {deptName}
                        </td>
                        <td className="p-3 border text-center">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">
                            {dept.doctor_count || dept.doctorCount || 0} doctor
                            {(dept.doctor_count || dept.doctorCount || 0) === 1 ? "" : "s"}
                          </span>
                        </td>
                        <td className="p-3 border text-center">
                          <button
                            onClick={() => handleDelete(dept.id, deptName)}
                            disabled={actionLoading}
                            className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition"
                            title="Delete Department"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="text-center">
                    <td colSpan="4" className="p-6 text-gray-500">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Department Modal */}
      {showAddModal && (
        <div
          className="z-50 fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-black/20 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="relative flex flex-col bg-white shadow-2xl border border-blue-100 rounded-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FaBuilding className="text-white" /> Add New Department
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white transition"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddDepartment} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology, Neurology, Radiology"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !newDepartmentName.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium text-sm shadow transition"
                >
                  {actionLoading ? "Adding..." : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;

