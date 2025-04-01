import React from "react";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col justify-center items-center w-full h-screen text-white">
      <div className="absolute inset-0 bg-img bg-cover bg-center brightness-75"></div>

      <nav className="top-0 left-0 z-10 absolute flex justify-between items-center p-4 sm:p-6 w-full text-white">
        <h1 className="font-bold text-lg sm:text-xl tracking-wide">
          <span className="text-white">eDoc.</span>
          <span className="hidden sm:inline"> | THE ECHANNELING PROJECT</span>
        </h1>
        <div className="flex space-x-3 sm:space-x-5">
          <button
            className="hover:bg-white px-3 sm:px-4 py-1 sm:py-2 border border-white rounded-md hover:text-black text-xs sm:text-sm transition"
            onClick={function () {
              navigate("/patient-login");
            }}
          >
            LOGIN
          </button>
          <button
            className="hover:bg-white px-3 sm:px-4 py-1 sm:py-2 border border-white rounded-md hover:text-black text-xs sm:text-sm transition"
            onClick={function () {
              navigate("/patient-register");
            }}
          >
            REGISTER
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="z-10 relative px-6 max-w-3xl text-center">
        <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-tight">
          Avoid Hassles & Delays.
        </h1>
        <p className="mt-4 text-gray-200 text-lg sm:text-xl">
          How is health today? Sounds like not good!
        </p>
        <p className="text-gray-300 text-md sm:text-lg">
          Don’t worry. Find your doctor online. Book as you wish with eDoc.
        </p>
        <p className="text-gray-300 text-md sm:text-lg">
          We offer you a free doctor channeling service. Make your appointment
          now.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 shadow-lg mt-6 px-8 py-3 rounded-full font-semibold text-lg transition">
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
