import React, { useEffect, useState } from "react";
import { FaUsers, FaUserMd, FaCalendarCheck } from "react-icons/fa";
import DashboardGraphs from "./DashboardGraphs";
import TodayAppointments from "./TodayAppointments";

const DashboardMain = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const sampleData = {
    totalPatients: 1245,
    totalDoctors: 42,
    totalAppointments: 876,
    totalNurses: 68,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
        <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
          <FaUsers size={32} className="mr-4 text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Patients</p>
            <p className="font-bold text-2xl">{data.totalPatients}</p>
          </div>
        </div>
        <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
          <FaUserMd size={32} className="mr-4 text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Doctors</p>
            <p className="font-bold text-2xl">{data.totalDoctors}</p>
          </div>
        </div>
        <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
          <FaCalendarCheck size={32} className="mr-4 text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Appointments</p>
            <p className="font-bold text-2xl">{data.totalAppointments}</p>
          </div>
        </div>
        <div className="flex items-center bg-white shadow-md p-6 rounded-lg">
          <FaUsers size={32} className="mr-4 text-red-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Nurses</p>
            <p className="font-bold text-2xl">{data.totalNurses}</p>
          </div>
        </div>
      </div>

      {/* Graphs Section */}
      <DashboardGraphs
        patientStats={data.patientStats}
        hospitalStatus={data.hospitalStatus}
      />

      {/* Appointments Section */}
      <TodayAppointments appointments={data.appointments} />
    </>
  );
};

export default DashboardMain;
