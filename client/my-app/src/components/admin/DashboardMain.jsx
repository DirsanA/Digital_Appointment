import React, { useEffect, useState } from "react";
import TodayAppointments from "./TodayAppointments";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaChartBar,
  FaChartPie,
  FaUser,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaSync,
  FaFileExcel
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DashboardMain = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    statusData: [],
    departmentData: [],
    appointments: [],
    loading: true,
    error: null,
  });

  const [chartViews, setChartViews] = useState({
    status: window.innerWidth < 768 ? "pie" : "bar",
    department: "pie",
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [refreshing, setRefreshing] = useState(false);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && chartViews.status === "bar") {
        setChartViews((prev) => ({ ...prev, status: "pie" }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chartViews.status]);

  const fetchData = async () => {
    try {
      setDashboardData((prev) => ({ ...prev, loading: true, error: null }));
      setRefreshing(true);

      const [statsRes, deptRes, appointmentsRes] = await Promise.all([
        fetch("http://localhost:5000/api/dashboard/stats"),
        fetch("http://localhost:5000/api/dashboard/graph-data"),
        fetch("http://localhost:5000/api/dashboard/today"),
      ]);

      if (!statsRes.ok || !deptRes.ok || !appointmentsRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const [statsJson, deptJson, appointmentsJson] = await Promise.all([
        statsRes.json(),
        deptRes.json(),
        appointmentsRes.json(),
      ]);

      const statusData =
        statsJson.data?.statusDistribution?.map((item) => ({
          name: item?.name
            ? item.name.charAt(0).toUpperCase() + item.name.slice(1)
            : "Unknown",
          value: item?.value || 0,
          color: getStatusColor(item?.name),
        })) || [];

      const departmentData =
        deptJson?.departmentDistribution?.map((dept) => ({
          name: dept?.name || "Other",
          value: dept?.value || 0,
          color: getDepartmentColor(dept?.name),
        })) || [];

      setDashboardData({
        stats: statsJson.data,
        statusData,
        departmentData,
        appointments: appointmentsJson.success ? appointmentsJson.data : [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to load dashboard data",
      }));
    } finally {
      setRefreshing(false);
    }
  };

  const generateExcelReport = async () => {
    try {
      setReportLoading(true);

      // Fetch all detailed data for Excel export with year filter
      const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/dashboard/excel/appointments?year=${reportYear}`),
        fetch("http://localhost:5000/api/dashboard/excel/doctors"),
        fetch("http://localhost:5000/api/dashboard/excel/patients"),
      ]);

      if (!appointmentsRes.ok || !doctorsRes.ok || !patientsRes.ok) {
        throw new Error("Failed to fetch data for Excel export");
      }

      const [appointmentsJson, doctorsJson, patientsJson] = await Promise.all([
        appointmentsRes.json(),
        doctorsRes.json(),
        patientsRes.json(),
      ]);

      const appointments = appointmentsJson.success ? appointmentsJson.data : [];
      const doctors = doctorsJson.success ? doctorsJson.data : [];
      const patients = patientsJson.success ? patientsJson.data : [];

      console.log('Excel Export Data:', {
        appointments: appointments.length,
        doctors: doctors.length,
        patients: patients.length,
        reportYear
      });

      // Prepare data for Excel
      const yearData = {
        statusData: dashboardData.statusData,
        departmentData: dashboardData.departmentData,
        stats: dashboardData.stats,
        year: reportYear,
      };

      // Create detailed appointments worksheet
      const appointmentsWS = XLSX.utils.json_to_sheet(
        appointments.map((apt) => ({
          "Appointment ID": apt.id,
          "Patient Name": apt.patient_name || "N/A",
          "Patient Email": apt.patient_email || "N/A",
          "Patient Phone": apt.patient_phone || "N/A",
          "Appointment Date": apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString() : "N/A",
          "Appointment Time": apt.appointment_time || "N/A",
          "Status": apt.status || "N/A",
          "Doctor Name": apt.doctor_name || "Not Assigned",
          "Department": apt.doctor_department || "General",
          "Doctor Email": apt.doctor_email || "N/A",
          "Doctor Contact": apt.doctor_contact || "N/A",
          "Created At": apt.created_at ? new Date(apt.created_at).toLocaleString() : "N/A",
          "Updated At": apt.updated_at ? new Date(apt.updated_at).toLocaleString() : "N/A",
        }))
      );

      // Create detailed doctors worksheet
      const doctorsWS = XLSX.utils.json_to_sheet(
        doctors.map((doc) => ({
          "Doctor ID": doc.id,
          "Doctor Name": doc.doctor_name || "N/A",
          "Email": doc.email || "N/A",
          "Department": doc.department || "N/A",
          "Contact": doc.contact || "N/A",
          "Experience": doc.experience || "N/A",
        }))
      );

      // Create detailed patients worksheet
      const patientsWS = XLSX.utils.json_to_sheet(
        patients.map((patient) => ({
          "Patient ID": patient.id,
          "Patient Name": patient.patient_name || "N/A",
          "Email": patient.email || "N/A",
          "Phone": patient.phone || "N/A",
        }))
      );

      // Create summary worksheet with year-specific data
      const yearSpecificStats = {
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
        cancelledAppointments: appointments.filter(apt => apt.status === 'cancelled').length,
        pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
        acceptedAppointments: appointments.filter(apt => apt.status === 'accepted').length,
        totalDoctors: doctors.length,
        totalPatients: patients.length,
      };

      const summaryWS = XLSX.utils.json_to_sheet([
        { Metric: "Year", Value: reportYear },
        { Metric: "Total Patients", Value: yearSpecificStats.totalPatients },
        { Metric: "Total Doctors", Value: yearSpecificStats.totalDoctors },
        {
          Metric: "Total Appointments",
          Value: yearSpecificStats.totalAppointments,
        },
        {
          Metric: "Completed Appointments",
          Value: yearSpecificStats.completedAppointments,
        },
        {
          Metric: "Cancelled Appointments",
          Value: yearSpecificStats.cancelledAppointments,
        },
        {
          Metric: "Pending Appointments",
          Value: yearSpecificStats.pendingAppointments,
        },
        {
          Metric: "Accepted Appointments",
          Value: yearSpecificStats.acceptedAppointments,
        },
      ]);

      // Create workbook with all worksheets
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, appointmentsWS, "All Appointments");
      XLSX.utils.book_append_sheet(wb, doctorsWS, "All Doctors");
      XLSX.utils.book_append_sheet(wb, patientsWS, "All Patients");
      XLSX.utils.book_append_sheet(wb, summaryWS, "Summary");

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Format the filename with current date
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
                        saveAs(
                    data,
                    `Medical_Dashboard_Complete_Report_${reportYear}_${formattedDate}.xlsx`
                  );
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  const fetchYearlyData = async (year) => {
    // In a real implementation, you would fetch data for the specific year
    // For this example, we'll just set the report year
    setReportYear(year);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "#F59E0B",
      accepted: "#10B981",
      cancelled: "#EF4444",
      completed: "#3B82F6",
      default: "#6B7280",
    };
    return colors[status?.toLowerCase()] || colors.default;
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      cardiology: "#3B82F6",
      neurology: "#22C55E",
      pediatrics: "#A855F7",
      orthopedics: "#EF4444",
      dermatology: "#F97316",
      default: "#10B981",
    };
    return colors[dept?.toLowerCase()] || colors.default;
  };

  const StatCard = ({ label, value, icon, color = "blue" }) => (
    <div
      className={`flex items-center gap-4 bg-white p-4 rounded-xl border border-${color}-100 shadow-sm hover:shadow-md transition-all`}
    >
      <div
        className={`text-${color}-500 text-2xl p-3 bg-${color}-50 rounded-lg`}
      >
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-500 text-sm">{label}</p>
        <p className="font-bold text-gray-800 text-xl md:text-2xl">
          {value !== undefined ? value : "--"}
        </p>
      </div>
    </div>
  );

  const renderChart = (data, chartType, colors) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex justify-center items-center bg-gray-50 rounded-xl h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}`, "Count"]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors.default}
                />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 50 : 70}
              outerRadius={isMobile ? 70 : 90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name}\n${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors.default}
                />
              ))}
            </Pie>
            <Tooltip />
            {!isMobile && (
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            )}
          </PieChart>
        )}
      </ResponsiveContainer>
    );
  };

  const ChartToggle = ({ active, onChange, isMobile }) => (
    <div className="flex bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onChange("bar")}
        className={`p-2 rounded-md flex items-center ${
          active === "bar" ? "bg-white shadow-sm" : "text-gray-500"
        }`}
      >
        <FaChartBar className="mr-1" />
        {!isMobile && "Bar"}
      </button>
      <button
        onClick={() => onChange("pie")}
        className={`p-2 rounded-md flex items-center ${
          active === "pie" ? "bg-white shadow-sm" : "text-gray-500"
        }`}
      >
        <FaChartPie className="mr-1" />
        {!isMobile && "Pie"}
      </button>
    </div>
  );

  if (dashboardData.loading && !refreshing) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white shadow-sm p-4 border border-gray-100 rounded-xl h-24 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white shadow-sm p-4 border border-gray-100 rounded-xl h-80 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-100 p-4 border-red-500 border-l-4 rounded text-red-700">
          <div className="flex items-center">
            <svg
              className="mr-2 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Error:</span> {dashboardData.error}
          </div>
          <button
            onClick={fetchData}
            className="flex items-center bg-red-600 hover:bg-red-700 mt-2 px-3 py-1 rounded text-white text-sm"
          >
            <FaSync className="mr-1" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6 mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="mb-1 font-bold text-gray-800 text-2xl md:text-3xl">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time overview of clinic appointments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={reportYear}
                onChange={(e) => fetchYearlyData(parseInt(e.target.value))}
                className="bg-white py-2 pr-8 pl-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
              >
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="right-0 absolute inset-y-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg
                  className="fill-current w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <button
              onClick={generateExcelReport}
              disabled={reportLoading}
              className={`flex items-center text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded ${
                reportLoading ? "opacity-70" : ""
              }`}
            >
              <FaFileExcel
                className={`mr-1 ${reportLoading ? "animate-pulse" : ""}`}
              />
              {reportLoading ? "Generating..." : "Export Excel"}
            </button>
            <button
              onClick={fetchData}
              className={`flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded ${
                refreshing ? "opacity-70" : ""
              }`}
              disabled={refreshing}
            >
              <FaSync className={`mr-1 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
          <StatCard
            label="Total Patients"
            value={dashboardData.stats?.totalPatients}
            icon={<FaUser />}
            color="blue"
          />
          <StatCard
            label="Total Doctors"
            value={dashboardData.stats?.totalDoctors}
            icon={<FaUserMd />}
            color="green"
          />
          <StatCard
            label="Total Appointments"
            value={dashboardData.stats?.totalAppointments}
            icon={<FaCalendarAlt />}
            color="purple"
          />
          <StatCard
            label="Today's Appointments"
            value={dashboardData.stats?.todayAppointments}
            icon={<FaClock />}
            color="amber"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm p-4 border border-gray-100 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Appointment Status
              </h3>
              <ChartToggle
                active={chartViews.status}
                onChange={(view) =>
                  setChartViews((prev) => ({ ...prev, status: view }))
                }
                isMobile={isMobile}
              />
            </div>
            <div className="h-64 md:h-80">
              {renderChart(dashboardData.statusData, chartViews.status, {
                pending: "#F59E0B",
                accepted: "#10B981",
                cancelled: "#EF4444",
                completed: "#3B82F6",
                default: "#6B7280",
              })}
            </div>
          </div>

          <div className="bg-white shadow-sm p-4 border border-gray-100 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Patient Distribution
              </h3>
              <ChartToggle
                active={chartViews.department}
                onChange={(view) =>
                  setChartViews((prev) => ({ ...prev, department: view }))
                }
                isMobile={isMobile}
              />
            </div>
            <div className="h-64 md:h-80">
              {renderChart(
                dashboardData.departmentData,
                chartViews.department,
                {
                  Cardiology: "#3B82F6",
                  Neurology: "#22C55E",
                  Pediatrics: "#A855F7",
                  Orthopedics: "#EF4444",
                  Dermatology: "#F97316",
                  default: "#10B981",
                }
              )}
            </div>
          </div>
        </div>
      </div>
      <TodayAppointments
        appointments={dashboardData.appointments}
        loading={dashboardData.loading && !refreshing}
        onRefresh={fetchData}
      />
    </div>
  );
};

export default DashboardMain;
