import { Link } from "react-router-dom";
import { FaCalendarPlus, FaHistory, FaUserCircle, FaPowerOff } from "react-icons/fa";
import bgImage from "./assets/b4.jpg"; // Import the uploaded image

const PatientDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-md p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-6 p-4">
            <img 
              src="./assets/hospital10.jpg" 
              alt="Hospital Logo" 
              className="h-20 w-20 object-contain mr-3" // Increased size and added width
            />
            <h1 className="text-xl font-bold text-red-600"></h1>
          </div>
          <nav className="space-y-4 pt-12">
            <Link to="/Patient-Dashbord" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <FaUserCircle size={20} />
              <span className="font-semibold">Dashboard</span>
            </Link>
            <Link to="/BookAppointment" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
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
      <main className="flex-1 p-6">
        {/* Welcome Message with Background Image */}
        <div
          className="relative p-6 rounded-lg shadow-md text-white w-full h-60 flex flex-col justify-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-2xl font-bold text-blue-500">Welcome, Patient.</h2>
          <p className="text-sm mt-2 text-blue-500">
          The hospital management systems provide real-time updates on patient vitals, 
          treatment progress, and appointment schedules, 
          enabling healthcare providers to deliver efficient, well-coordinated,
           and personalized care. By streamlining data access and improving communication
            among medical staff, these systems enhance decision-making, reduce errors,
             and optimize overall patient outcomes.
          </p>
        </div>

        {/* Appointment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Link to="/BookAppointment" className="bg-gradient-to-r from-blue-300 to-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transform transition hover:scale-105">
            <FaCalendarPlus size={40} />
            <h3 className="text-lg font-semibold mt-2">Book My Appointment</h3>
            <p className="text-sm">Book Appointment</p>
          </Link>

          <Link to="/AppointmentHistory" className="bg-gradient-to-r from-green-300 to-green-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transform transition hover:scale-105">
            <FaHistory size={40} />
            <h3 className="text-lg font-semibold mt-2">My Appointment History</h3>
            <p className="text-sm">My Appointment</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;