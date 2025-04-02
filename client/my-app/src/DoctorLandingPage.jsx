import React, { useState } from "react";
import bgImg from "/assets/doctorBg.png";

const DoctorLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative flex md:flex-row flex-col bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      {/* Desktop Sidebar - Hidden on mobile, shown on tablet and desktop */}
      <aside className="hidden md:flex flex-col bg-white shadow-xl p-4 md:p-6 w-full md:w-64 lg:w-72 min-h-screen">
        <div className="text-center">
          <div className="bg-gray-300 mx-auto rounded-full w-16 md:w-20 h-16 md:h-20"></div>
          <h2 className="mt-2 font-semibold text-gray-700 text-md md:text-lg">
            Test Doctor
          </h2>
          <p className="text-gray-500 text-xs md:text-sm">doctor@edoc.com</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 shadow-md mt-4 md:mt-6 py-2 md:py-3 rounded-lg w-full font-semibold text-white text-sm md:text-base">
          Log out
        </button>
        <nav className="space-y-2 md:space-y-3 mt-6 md:mt-8 text-gray-700">
          <a
            href="#"
            className="block bg-blue-100 px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block hover:bg-blue-100 px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base"
          >
            My Appointments
          </a>
          <a
            href="#"
            className="block hover:bg-blue-100 px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base"
          >
            My Patients
          </a>
        </nav>
      </aside>

      {/* Mobile Header - Shown only on mobile */}
      <header className="md:hidden top-0 z-30 sticky flex justify-between items-center bg-white shadow-md p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-300 rounded-full w-10 h-10"></div>
          <div>
            <h2 className="font-semibold text-gray-700 text-sm">Test Doctor</h2>
            <p className="text-gray-500 text-xs">doctor@edoc.com</p>
          </div>
        </div>
        <button
          onClick={toggleMenu}
          className="flex flex-col justify-center items-center w-8 h-8"
          aria-label="Menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-blue-600 transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-blue-600 transition-all duration-300 mt-1.5 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-blue-600 transition-all duration-300 mt-1.5 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
            }`}
          ></span>
        </button>
      </header>

      {/* Mobile Menu - Floating overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Overlay background */}
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMenu}
        ></div>

        {/* Menu content */}
        <div
          className={`absolute top-0 right-0 bg-white shadow-lg w-3/4 h-full transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col p-4 h-full">
            {/* Collapse button at the top */}
            <button
              onClick={toggleMenu}
              className="self-end p-2 text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-6 text-center">
              <div className="bg-gray-300 mx-auto rounded-full w-16 h-16"></div>
              <h2 className="mt-2 font-semibold text-gray-700">Test Doctor</h2>
              <p className="text-gray-500 text-sm">doctor@edoc.com</p>
            </div>

            <nav className="flex-1 space-y-3 text-gray-700">
              <a
                href="#"
                className="block bg-blue-100 px-4 py-3 rounded-lg font-medium"
                onClick={toggleMenu}
              >
                <span className="flex items-center">
                  <svg
                    className="mr-3 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Dashboard
                </span>
              </a>
              <a
                href="#"
                className="block hover:bg-blue-100 px-4 py-3 rounded-lg"
                onClick={toggleMenu}
              >
                <span className="flex items-center">
                  <svg
                    className="mr-3 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  My Appointments
                </span>
              </a>
              <a
                href="#"
                className="block hover:bg-blue-100 px-4 py-3 rounded-lg"
                onClick={toggleMenu}
              >
                <span className="flex items-center">
                  <svg
                    className="mr-3 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  My Patients
                </span>
              </a>
            </nav>

            <button
              className="flex justify-center items-center bg-blue-600 hover:bg-blue-700 shadow-md mt-auto py-3 rounded-lg w-full font-semibold text-white"
              onClick={toggleMenu}
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-8 ${isMenuOpen ? "z-20" : "z-10"}`}>
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center space-y-3 md:space-y-0">
          <h1 className="font-bold text-gray-800 text-2xl md:text-3xl">
            Dashboard
          </h1>
          <div className="bg-white shadow-md px-4 md:px-6 py-2 md:py-3 rounded-lg w-full md:w-auto">
            <span className="text-gray-500 text-xs md:text-sm">
              Today's Date
            </span>
            <p className="font-semibold text-gray-700 text-md md:text-lg">
              2022-06-03
            </p>
          </div>
        </div>

        {/* Welcome Card with Background Image */}
        <div className="relative shadow-xl mt-6 p-6 rounded-lg min-h-[200px] overflow-hidden">
          {/* Background image */}
          <div
            className="z-0 absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImg})` }}
          ></div>

          {/* Gradient overlay - now only covering part of the image */}
          <div className="z-0 absolute inset-0 bg-gradient-to-r from-10% from-white via-30% via-white/70 to-90% to-transparent"></div>

          {/* Content */}
          <div className="z-10 relative flex md:flex-row flex-col items-center">
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800 text-xl md:text-2xl">
                Welcome!
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Thanks for joining us. We are always trying to get you a
                complete service...
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 shadow-md mt-3 md:mt-4 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-white text-sm md:text-base">
                View My Appointments
              </button>
            </div>
          </div>
        </div>

        {/* Status Cards - Now 3 cards */}
        <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-3 mt-6 md:mt-8">
          <div className="bg-white shadow-md p-4 md:p-6 rounded-lg text-center">
            <p className="font-bold text-blue-600 text-2xl md:text-3xl">1</p>
            <p className="text-gray-500 text-xs md:text-sm">All Doctors</p>
          </div>
          <div className="bg-white shadow-md p-4 md:p-6 rounded-lg text-center">
            <p className="font-bold text-blue-600 text-2xl md:text-3xl">2</p>
            <p className="text-gray-500 text-xs md:text-sm">All Patients</p>
          </div>
          <div className="bg-white shadow-md p-4 md:p-6 rounded-lg text-center">
            <p className="font-bold text-blue-600 text-2xl md:text-3xl">1</p>
            <p className="text-gray-500 text-xs md:text-sm">New Booking</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorLandingPage;
