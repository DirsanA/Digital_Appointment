import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaUserCircle, FaUserMd, FaUsers, FaCalendarCheck, FaSignOutAlt, FaUserPlus, FaThLarge, FaBars, FaTimes } from "react-icons/fa";

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample data structure with simplified hospitalStatus
  const sampleData = {
    totalPatients: 1245,
    totalDoctors: 42,
    totalAppointments: 876,
    totalNurses: 68, // Added nurses count
    patientStats: [
      { name: "Cardiology", value: 320 },
      { name: "Neurology", value: 240 },
      { name: "Pediatrics", value: 180 },
      { name: "Orthopedics", value: 150 },
      { name: "Dermatology", value: 110 },
      { name: "Other", value: 245 }
    ],
    hospitalStatus: [
      { name: "Patients", value: 145 },
      { name: "Doctors", value: 28 },
      { name: "App", value: 76 },
      { name: "Nurses", value: 32 }
    ],
    appointments: [
      { patient: "John Smith", doctor: "Dr. Sarah Johnson", time: "10:00 AM" },
      { patient: "Emily Davis", doctor: "Dr. Michael Chen", time: "11:30 AM" },
      { patient: "Robert Wilson", doctor: "Dr. Olivia Patel", time: "02:15 PM" },
      { patient: "Maria Garcia", doctor: "Dr. James Wilson", time: "03:45 PM" },
      { patient: "David Lee", doctor: "Dr. Emily Rodriguez", time: "04:30 PM" }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(sampleData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(sampleData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const colors = ["#3B82F6", "#22C55E", "#A855F7", "#EF4444", "#F97316", "#10B981"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10 flex justify-end">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:right-0 md:translate-x-0 md:w-1/4`}>
        <div className="overflow-y-auto">
          <h2 className="text-lg font-bold mb-6 flex items-center p-4">
            <FaUserCircle className="text-blue-500 text-4xl mr-3" /> Admin
          </h2>
          <nav className="space-y-2">
            <Link 
              to="/AdminDashboard" 
              className="flex items-center space-x-2 p-2 bg-gray-200 rounded-md font-semibold"
              onClick={() => setSidebarOpen(false)}
            >
              <FaThLarge size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/Doctors" 
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-200 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd size={20} />
              <span>Doctors</span>
            </Link>
            <Link 
              to="/Departments" 
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-200 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsers size={20} />
              <span>Departments</span>
            </Link>
            <Link 
              to="/Appointments" 
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-200 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarCheck size={20} />
              <span>Appointments</span>
            </Link>
            <Link 
              to="/AddDoctors" 
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-200 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserPlus size={20} />
              <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link 
          to="/Logout" 
          className="flex items-center space-x-2 p-2 text-red-500 hover:bg-red-50 rounded-md"
          onClick={() => setSidebarOpen(false)}
        >
          <FaSignOutAlt size={20} />
          <span>Log out</span>
        </Link>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0 overflow-y-auto">
        {/* Stats Cards with White Background - Added Nurses card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
            <FaUsers size={32} className="text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-2xl font-bold">{data.totalPatients || 0}</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
            <FaUserMd size={32} className="text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Doctors</p>
              <p className="text-2xl font-bold">{data.totalDoctors || 0}</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
            <FaCalendarCheck size={32} className="text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Appointments</p>
              <p className="text-2xl font-bold">{data.totalAppointments || 0}</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
            <FaUsers size={32} className="text-red-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Nurses</p>
              <p className="text-2xl font-bold">{data.totalNurses || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Pie Chart - Patient Distribution by Department */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-bold mb-2">Patient Distribution by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={data.patientStats} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.patientStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    value, 
                    `${name}: ${((props.payload.percent || 0) * 100).toFixed(1)}%`
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Simplified with only 4 metrics */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-bold mb-2">Hospital Today's Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.hospitalStatus}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Count" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white p-4 mt-6 shadow-md rounded-lg">
          <h3 className="text-lg font-bold mb-4">Today's Appointments</h3>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border text-left">Patient</th>
                  <th className="p-3 border text-left">Doctor</th>
                  <th className="p-3 border text-left">Time</th>
                  <th className="p-3 border text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.appointments?.map((appt, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border">{appt.patient}</td>
                    <td className="p-3 border">{appt.doctor}</td>
                    <td className="p-3 border">{appt.time}</td>
                    <td className="p-3 border">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        index % 3 === 0 ? "bg-green-100 text-green-800" : 
                        index % 3 === 1 ? "bg-yellow-100 text-yellow-800" : 
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {index % 3 === 0 ? "Completed" : index % 3 === 1 ? "Pending" : "In Progress"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;