import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarPlus, FaHistory, FaUserCircle, FaPowerOff } from "react-icons/fa";
import bgImage from "./assets/b4.jpg";

const BookAppointment = () => {
  const [appointment, setAppointment] = useState({
    doctor: "Dirsan",
    contact: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment Data:", appointment);
    alert("Appointment booked successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-md p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-6 p-4">
            <img 
              src="./assets/hospital10.jpg" 
              alt="Hospital Logo" 
              className="h-20 w-20 object-contain mr-3" 
            />
            <h1 className="text-xl font-bold text-red-600"></h1>
          </div>
          <nav className="space-y-4 pt-12">
            <Link to="/Patient-Dashbord" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <FaUserCircle size={20} />
              <span className="font-semibold">Dashboard</span>
            </Link>
            <Link to="/BookAppointment" className="flex items-center space-x-2 text-blue-500 font-bold">
              <FaCalendarPlus size={20} />
              <span>Book Appointment</span>
            </Link>
            <Link to="/AppointmentHistory" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <FaHistory size={20} />
              <span>Appointment History</span>
            </Link>
          </nav>
        </div>
        <Link to="/logout" className="flex items-center space-x-2 text-red-500 hover:text-red-700">
          <FaPowerOff size={20} />
          <span>Log out</span>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center">
        {/* Welcome Section with Increased Width */}
        <div
          className="relative p-6 rounded-lg shadow-md text-white w-full h-48 flex flex-col justify-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-2xl font-bold text-blue-500">Welcome, Patient.</h2>
          <p className="mt-2 text-blue-500">
            Manage your appointments easily with our healthcare system.
          </p>
        </div>

        {/* Appointment Form with Increased Width */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Create an Appointment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Doctor Selection */}
            <div>
              <label className="block text-gray-700 text-sm">Doctors</label>
              <select
                name="doctor"
                value={appointment.doctor}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-gray-900 text-sm"
              >
                <option value="Dirsan">Dirsan</option>
                <option value="Smith">Dr. Smith</option>
                <option value="Johnson">Dr. Johnson</option>
              </select>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-gray-700 text-sm">Contact</label>
              <input
                type="text"
                name="contact"
                value={appointment.contact}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-gray-900 text-sm"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-700 text-sm">Date</label>
              <input
                type="date"
                name="date"
                value={appointment.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-gray-900 text-sm"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-gray-700 text-sm">Time</label>
              <input
                type="time"
                name="time"
                value={appointment.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-gray-900 text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md text-sm hover:bg-purple-700 transition"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;