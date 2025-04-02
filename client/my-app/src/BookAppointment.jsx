import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarPlus, FaHistory, FaUserCircle, FaPowerOff, FaBars, FaTimes } from "react-icons/fa";
import bgImage from "./assets/b4.jpg";

const BookAppointment = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointment, setAppointment] = useState({
    patientName: "",
    department: "",
    date: "",
    email: "",
    doctor: "",
    time: "",
    phone: ""
  });
  const currentPatientName = "Abenezer"; // Replace with dynamic patient data

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment Data:", appointment);
    alert("Appointment booked successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10 flex justify-between items-center">
        <div className="flex items-center">
          <FaUserCircle className="text-blue-500 text-2xl mr-3" />
          <h1 className="text-lg font-bold text-blue-600">{currentPatientName}</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-1/4`}>
        <div className="overflow-y-auto">
          <div className="flex items-center mb-6 p-4 md:mt-0 mt-12">
            <div className="flex items-center">
              <FaUserCircle className="text-blue-500 text-4xl mr-3" />
              <div>
                <h1 className="text-xl font-bold text-blue-600">{currentPatientName}</h1>
                <p className="text-sm text-gray-500">Registered Patient</p>
              </div>
            </div>
          </div>
          <nav className="space-y-4 pt-12">
            <Link 
              to="/Patient-Dashbord" 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <FaUserCircle size={20} />
              <span className="font-semibold">Dashboard</span>
            </Link>
            <Link 
              to="/BookAppointment" 
              className="flex items-center space-x-2 text-blue-500 font-bold"
              onClick={() => setSidebarOpen(false)}
            >
              <FaCalendarPlus size={20} />
              <span>Book Appointment</span>
            </Link>
            <Link 
              to="/AppointmentHistory" 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <FaHistory size={20} />
              <span>Appointment History</span>
            </Link>
          </nav>
        </div>
        <Link 
          to="/logout" 
          className="flex items-center space-x-2 text-red-500 hover:text-red-700"
          onClick={() => setSidebarOpen(false)}
        >
          <FaPowerOff size={20} />
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
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div
            className="relative p-6 rounded-lg shadow-md text-white w-full h-48 flex flex-col justify-center mb-8"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="text-2xl font-bold text-blue-500">Wellcome {currentPatientName} </h2>
            <p className="mt-2 text-blue-500">
              Schedule your medical appointment with our specialists
            </p>
          </div>

          {/* Appointment Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaCalendarPlus className="mr-2 text-purple-600" />
              Appointment Details
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={appointment.patientName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Department</label>
                <select
                  name="department"
                  value={appointment.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={appointment.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              {/* Patient Email */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Patient Email</label>
                <input
                  type="email"
                  name="email"
                  value={appointment.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  required
                />
              </div>

              {/* Doctor Name */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Doctor Name</label>
                <select
                  name="doctor"
                  value={appointment.doctor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  required
                >
                  <option value="">Select Doctor</option>
                  <option value="Dr. Dirsan">Dr. Dirsan</option>
                  <option value="Dr. Elias">Dr. Elias</option>
                  <option value="Dr. Haileeysus">Dr. Haileeysus</option>
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={appointment.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  required
                />
              </div>

              {/* Patient Phone Number */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">Patient Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={appointment.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-3 rounded-lg text-md font-semibold hover:from-purple-700 hover:to-blue-600 transition-all shadow-md"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;