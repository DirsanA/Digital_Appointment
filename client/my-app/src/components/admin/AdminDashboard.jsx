import React, { useState } from "react";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import DashboardMain from "./DashboardMain";
import Doctors from "./Doctors";
import Departments from "./Departments";
import Appointments from "./Appointments";
import AddDoctors from "./AddDoctors";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-100 h-screen text-black">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Dashboard Content */}
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        <Routes>
          <Route path="/AdminDashboard" element={<DashboardMain />} />
          <Route path="/admin/getAllDoctors" element={<Doctors />} />
          <Route path="/Departments" element={<Departments />} />
          <Route path="/Appointments" element={<Appointments />} />
          <Route path="/admin/doctors" element={<AddDoctors />} />
          <Route path="/" element={<DashboardMain />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
