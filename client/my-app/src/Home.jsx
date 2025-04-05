import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full h-screen text-white">
      <div className="absolute inset-0 bg-img bg-cover bg-center brightness-75"></div>

      <nav className="top-0 left-0 z-10 absolute flex justify-between items-center p-4 sm:p-6 w-full text-white">
        <div className="flex items-center">
          <h1 className="font-bold text-lg sm:text-xl tracking-wide">
            <span className="text-white">eDoc.</span>
            <span className="hidden sm:inline"> | THE ECHANNELING PROJECT</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/About" className="hover:text-gray-300 transition">
            About Us
          </Link>
          <Link to="/Service" className="hover:text-gray-300 transition">
            Services
          </Link>
          <Link to="/OurDoctors" className="hover:text-gray-300 transition">
            Our Doctors
          </Link>
          <Link to="/AddAppointment" className="hover:text-gray-300 transition">
            Add Appointment
          </Link>
          <div className="flex space-x-3 sm:space-x-5 ml-4">
            <button
              className="hover:bg-white px-3 sm:px-4 py-1 sm:py-2 border border-white rounded-md hover:text-black text-xs sm:text-sm transition"
              onClick={() => navigate("/patient-login")}
            >
              LOGIN
            </button>
            <button
              className="hover:bg-white px-3 sm:px-4 py-1 sm:py-2 border border-white rounded-md hover:text-black text-xs sm:text-sm transition"
              onClick={() => navigate("/patient-register")}
            >
              REGISTER
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden z-20 absolute top-16 left-0 right-0 bg-gray-800 bg-opacity-95 text-white py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link
              to="/Aabout"
              className="hover:text-gray-300 transition py-2"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/Service"
              className="hover:text-gray-300 transition py-2"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link
              to="/OurDoctors"
              className="hover:text-gray-300 transition py-2"
              onClick={toggleMenu}
            >
              Our Doctors
            </Link>
            <Link
              to="/AddAppointment"
              className="hover:text-gray-300 transition py-2"
              onClick={toggleMenu}
            >
              Add Appointment
            </Link>
            <div className="flex space-x-3 pt-2">
              <button
                className="hover:bg-white px-4 py-2 border border-white rounded-md hover:text-black text-sm transition w-full"
                onClick={() => {
                  toggleMenu();
                  navigate("/patient-login");
                }}
              >
                LOGIN
              </button>
              <button
                className="hover:bg-white px-4 py-2 border border-white rounded-md hover:text-black text-sm transition w-full"
                onClick={() => {
                  toggleMenu();
                  navigate("/patient-register");
                }}
              >
                REGISTER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="z-10 relative px-6 max-w-3xl text-center">
        <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-tight">
          Avoid Hassles & Delays.
        </h1>
        <p className="mt-4 text-gray-200 text-lg sm:text-xl">
          How is health today? Sounds like not good!
        </p>
        <p className="text-gray-300 text-md sm:text-lg">
          Don't worry. Find your doctor online. Book as you wish with eDoc.
        </p>
        <p className="text-gray-300 text-md sm:text-lg">
          We offer you a free doctor channeling service. Make your appointment
          now.
        </p>
        <button 
          className="bg-blue-500 hover:bg-blue-600 shadow-lg mt-6 px-8 py-3 rounded-full font-semibold text-lg transition"
          onClick={() => navigate("/AddAppointment")}
        >
          Make Appointment
        </button>
      </div>

      {/* Footer */}
      <footer className="bottom-4 z-10 absolute text-gray-300 text-sm text-center">
        A Web Solution by Desu and Dirsan.
      </footer>
    </div>
  );
};

export default LandingPage;