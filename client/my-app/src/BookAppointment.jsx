import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarPlus,
  FaHistory,
  FaUserCircle,
  FaPowerOff,
  FaBars,
  FaTimes,
} from "react-icons/fa";
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
    phone: "",
    gender: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const currentPatientName = "Abenezer";

  // Predefined departments
  const departments = ["Cardiology", "Neurology", "Orthopedics"];

  // Fetch doctors when department changes
  useEffect(() => {
    const fetchDoctorsByDepartment = async () => {
      if (!appointment.department) {
        setDoctors([]);
        return;
      }

      try {
        setFetchingDoctors(true);
        const response = await fetch(
          `http://localhost:5000/getDoctorsByDepartment?department=${appointment.department}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setFetchingDoctors(false);
      }
    };

    fetchDoctorsByDepartment();
  }, [appointment.department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_name: appointment.patientName,
          department: appointment.department,
          appointment_date: appointment.date,
          patient_email: appointment.email,
          doctor_id: appointment.doctor,
          appointment_time: appointment.time,
          patient_phone: appointment.phone,
          patient_gender: appointment.gender,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      const result = await response.json();
      console.log("Appointment booked:", result);
      alert("Appointment booked successfully!");

      // Reset form
      setAppointment({
        patientName: "",
        department: "",
        date: "",
        email: "",
        doctor: "",
        time: "",
        phone: "",
        gender: "",
      });
      setDoctors([]);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      {/* Mobile Header - Right-aligned */}
      <div className="md:hidden top-0 right-0 left-0 z-10 fixed flex justify-end bg-white shadow-md p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="focus:outline-none text-gray-700"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar - Right Side */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white shadow-md p-5 flex flex-col justify-between z-20 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:right-0 md:translate-x-0 md:w-1/4`}
      >
        <div className="overflow-y-auto">
          <div className="flex items-center mt-12 md:mt-0 mb-6 p-4">
            <div className="flex items-center">
              <FaUserCircle className="mr-3 text-blue-500 text-4xl" />
              <div>
                <h1 className="font-bold text-blue-600 text-xl">
                  {currentPatientName}
                </h1>
                <p className="text-gray-500 text-sm">Registered Patient</p>
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
              className="flex items-center space-x-2 font-bold text-blue-500"
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
          className="md:hidden z-10 fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 md:mr-0 p-6 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div
            className="relative flex flex-col justify-center shadow-md mb-8 p-6 rounded-lg w-full h-48 text-white"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="font-bold text-blue-500 text-2xl">
              Welcome {currentPatientName}
            </h2>
            <p className="mt-2 text-blue-500">
              Schedule your medical appointment with our specialists
            </p>
          </div>

          {/* Appointment Form */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="flex items-center mb-6 font-semibold text-gray-800 text-xl">
              <FaCalendarPlus className="mr-2 text-purple-600" />
              Appointment Details
            </h3>

            <form
              onSubmit={handleSubmit}
              className="gap-6 grid grid-cols-1 md:grid-cols-2"
            >
              {/* Patient Name */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={appointment.patientName}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Gender
                </label>
                <select
                  name="gender"
                  value={appointment.gender}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Department
                </label>
                <select
                  name="department"
                  value={appointment.department}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={appointment.date}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                />
              </div>

              {/* Patient Email */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Patient Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={appointment.email}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                />
              </div>

              {/* Doctor Name */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Doctor Name
                </label>
                <select
                  name="doctor"
                  value={appointment.doctor}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                  disabled={!appointment.department || fetchingDoctors}
                >
                  <option value="">Select Doctor</option>
                  {fetchingDoctors ? (
                    <option value="" disabled>
                      Loading doctors...
                    </option>
                  ) : (
                    doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={appointment.time}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                />
              </div>

              {/* Patient Phone Number */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Patient Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={appointment.phone}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 focus:border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 w-full text-gray-700"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-700 hover:from-purple-700 hover:to-blue-600 shadow-md py-3 rounded-lg w-full font-semibold text-md text-white transition-all"
                  disabled={loading || fetchingDoctors}
                >
                  {loading ? "Processing..." : "Create Appointment"}
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
