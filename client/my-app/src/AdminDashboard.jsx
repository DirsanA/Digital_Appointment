import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaUserCircle,
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaSignOutAlt,
  FaUserPlus,
  FaThLarge,
  FaBars,
  FaTimes,
} from "react-icons/fa";

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
      { name: "Other", value: 245 },
    ],
    hospitalStatus: [
      { name: "Patients", value: 145 },
      { name: "Doctors", value: 28 },
      { name: "App", value: 76 },
      { name: "Nurses", value: 32 },
    ],
    appointments: [
      { patient: "John Smith", doctor: "Dr. Sarah Johnson", time: "10:00 AM" },
      { patient: "Emily Davis", doctor: "Dr. Michael Chen", time: "11:30 AM" },
      {
        patient: "Robert Wilson",
        doctor: "Dr. Olivia Patel",
        time: "02:15 PM",
      },
      { patient: "Maria Garcia", doctor: "Dr. James Wilson", time: "03:45 PM" },
      { patient: "David Lee", doctor: "Dr. Emily Rodriguez", time: "04:30 PM" },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
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

  const colors = [
    "#3B82F6",
    "#22C55E",
    "#A855F7",
    "#EF4444",
    "#F97316",
    "#10B981",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 h-screen text-black">
      {/* Mobile Header */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-gray-700"
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
        <div className="overflow-y-auto">
          <h2 className="flex items-center mb-6 p-4 font-bold text-lg">
            <FaUserCircle className="mr-3 text-blue-500 text-4xl" /> Admin
          </h2>
          <nav className="space-y-2">
            <Link
              to="/AdminDashboard"
              className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md font-semibold"
              onClick={() => setSidebarOpen(false)}
            >
              <FaThLarge size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/getAllDoctors"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserMd size={20} />
              <span>Doctors</span>
            </Link>
            <Link
              to="/Departments"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsers size={20} />
              <span>Departments</span>
            </Link>
            <Link
              to="/Appointments"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarCheck size={20} />
              <span>Appointments</span>
            </Link>
            <Link
              to="/admin/doctors"
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-md text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserPlus size={20} />
              <span>Add Doctors</span>
            </Link>
          </nav>
        </div>
        <Link
          to="/Logout"
          className="flex items-center space-x-2 hover:bg-red-50 p-2 rounded-md text-red-500"
          onClick={() => setSidebarOpen(false)}
        >
          <FaSignOutAlt size={20} />
          <span>Log out</span>
        </Link>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden z-10 fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:ml-0 p-6 overflow-y-auto">
        {/* Stats Cards with White Background - Added Nurses card */}
        <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
          <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
            <FaUsers size={32} className="mr-4 text-blue-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Patients</p>
              <p className="font-bold text-2xl">{data.totalPatients || 0}</p>
            </div>
          </div>
          <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
            <FaUserMd size={32} className="mr-4 text-green-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Doctors</p>
              <p className="font-bold text-2xl">{data.totalDoctors || 0}</p>
            </div>
          </div>
          <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
            <FaCalendarCheck size={32} className="mr-4 text-purple-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Appointments</p>
              <p className="font-bold text-2xl">
                {data.totalAppointments || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
            <FaUsers size={32} className="mr-4 text-red-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Nurses</p>
              <p className="font-bold text-2xl">{data.totalNurses || 0}</p>
            </div>
          </div>
        </div>

        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-6">
          {/* Pie Chart - Patient Distribution by Department */}
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="mb-2 font-bold text-lg">
              Patient Distribution by Department
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.patientStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.patientStats?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    value,
                    `${name}: ${((props.payload.percent || 0) * 100).toFixed(
                      1
                    )}%`,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Simplified with only 4 metrics */}
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="mb-2 font-bold text-lg">Hospital Today's Status</h3>
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
        <div className="bg-white shadow-md mt-6 p-4 rounded-lg">
          <h3 className="mb-4 font-bold text-lg">Today's Appointments</h3>
          <div className="overflow-x-auto">
            <table className="border w-full">
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
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          index % 3 === 0
                            ? "bg-green-100 text-green-800"
                            : index % 3 === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {index % 3 === 0
                          ? "Completed"
                          : index % 3 === 1
                          ? "Pending"
                          : "In Progress"}
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
