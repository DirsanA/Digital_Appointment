import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaUsers,
  FaThLarge,
  FaUserMd,
  FaCalendarCheck,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaBuilding,
  FaEdit,
  FaTrash,
  FaCheck,
  FaEllipsisV,
} from "react-icons/fa";
import axios from "axios";
import { Menu } from "@headlessui/react";
import AdminSidebar from "./AdminSidebar";

const Departments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    desktopCount: 16,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "http://localhost:5000/admin/getAllDepartments"
        );

        // Ensure we have valid array data
        const responseData = response.data;
        const departmentsData = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.departments)
          ? responseData.departments
          : [];

        setDepartments(departmentsData);

        // Calculate total doctors
        const totalDoctors = departmentsData.reduce(
          (sum, dept) => sum + (dept.doctor_count || dept.doctorCount || 0),
          0
        );

        setStats((prev) => ({
          ...prev,
          totalDoctors: totalDoctors,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load departments data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/admin/getAllDepartments?search=${searchTerm}`
      );

      const responseData = response.data;
      const filteredData = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.departments)
        ? responseData.departments
        : [];

      setDepartments(filteredData);
    } catch (error) {
      console.error("Error searching departments:", error);
      setError("Failed to search departments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden text-black">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          {/* Departments Table */}
          <div className="bg-white shadow-md p-4 rounded-lg overflow-x-auto">
            <table className="border w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Department</th>
                  <th className="p-2 border">Number Of Doctors</th>
                  <th className="p-2 border">Department ID</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <tr key={dept.id} className="text-center">
                      <td className="p-2 border">
                        {dept.department_name || dept.name}
                      </td>
                      <td className="p-2 border">
                        {dept.doctor_count || dept.doctorCount || 0}
                      </td>
                      <td className="p-2 border">{dept.id}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan="3" className="p-4 text-gray-500">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Departments;
