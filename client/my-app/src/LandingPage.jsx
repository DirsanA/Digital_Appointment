import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AboutUs from "./About";
import Services from "./Service";
import OurDoctors from "./OurDoctors";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const doctorsRef = useRef(null);
  const appointmentRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  // Add scroll event listener to handle navbar transparency
  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="relative flex flex-col bg-black w-screen min-h-screen overflow-x-hidden text-white">
      {/* Navigation Bar - Now with transparent background */}
      <nav
        className={`top-0 left-0 z-50 fixed flex justify-between items-center p-4 sm:p-6 w-full text-white transition-all duration-300 ${
          scrolled
            ? "bg-black bg-opacity-80 backdrop-blur-sm"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center">
          <h1 className="font-bold text-lg sm:text-xl tracking-wide">
            <span className="text-white">eDoc.</span>
            <span className="hidden sm:inline"> | THE ECHANNELING PROJECT</span>
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => scrollToSection(aboutRef)}
            className="hover:text-gray-300 transition"
          >
            About Us
          </button>
          <button
            onClick={() => scrollToSection(servicesRef)}
            className="hover:text-gray-300 transition"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection(doctorsRef)}
            className="hover:text-gray-300 transition"
          >
            Our Doctors
          </button>
          <button
            onClick={() => scrollToSection(appointmentRef)}
            className="hover:text-gray-300 transition"
          >
            Make Appointment
          </button>
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
            className="focus:outline-none text-white"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

      {/* Mobile Nav Items */}
      {isMenuOpen && (
        <div className="md:hidden top-16 right-0 left-0 z-40 fixed bg-gray-800 bg-opacity-95 px-6 py-4 text-white">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="py-2 hover:text-gray-300 text-left transition"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection(servicesRef)}
              className="py-2 hover:text-gray-300 text-left transition"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection(doctorsRef)}
              className="py-2 hover:text-gray-300 text-left transition"
            >
              Our Doctors
            </button>
            <button
              onClick={function () {
                navigate("/patient-login");
              }}
              className="py-2 hover:text-gray-300 text-left transition"
            >
              Make Appointment
            </button>
            <div className="flex space-x-3 pt-2">
              <button
                className="hover:bg-white px-4 py-2 border border-white rounded-md w-full hover:text-black text-sm transition"
                onClick={() => navigate("/patient-login")}
              >
                LOGIN
              </button>
              <button
                className="hover:bg-white px-4 py-2 border border-white rounded-md w-full hover:text-black text-sm transition"
                onClick={() => navigate("/patient-register")}
              >
                REGISTER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative flex justify-center items-center w-full h-screen">
        <div className="absolute inset-0 bg-img bg-cover bg-center brightness-75 w-full h-full"></div>
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
            onClick={() => scrollToSection(appointmentRef)}
          >
            Make Appointment
          </button>
        </div>
      </section>

      {/* Content Sections */}
      <div ref={aboutRef} className="w-full">
        <AboutUs />
      </div>

      <div ref={servicesRef} className="w-full">
        <Services />
      </div>

      <div ref={doctorsRef} className="w-full">
        <OurDoctors />
      </div>

      {/* Footer */}
      <footer className="bg-black py-8 w-full text-center">
        <p className="text-gray-400">A Web Solution by Desu and Dirsan.</p>
        <p className="mt-2 text-gray-500 text-sm">
          © 2023 eDoc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
