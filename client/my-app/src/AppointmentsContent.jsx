import React from "react";

const AppointmentsContent = () => {
  return (
    <>
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center space-y-3 md:space-y-0">
        <h1 className="font-bold text-gray-800 text-2xl md:text-3xl">
          My Appointments
        </h1>
        <div className="bg-white shadow-md px-4 md:px-6 py-2 md:py-3 rounded-lg w-full md:w-auto">
          <span className="text-gray-500 text-xs md:text-sm">Today's Date</span>
          <p className="font-semibold text-gray-700 text-md md:text-lg">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4 mt-6">
        {/* Sample Appointment Card */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex md:flex-row flex-col md:justify-between md:items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-300 rounded-full w-12 h-12"></div>
              <div>
                <h3 className="font-medium text-gray-900">John Doe</h3>
                <p className="text-gray-500 text-sm">Regular Checkup</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="font-medium text-gray-900 text-sm">
                2023-06-10 at 10:00 AM
              </p>
              <div className="mt-1">
                <span className="bg-green-100 px-2 py-1 rounded-full text-green-800 text-xs">
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Another Sample Appointment Card */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex md:flex-row flex-col md:justify-between md:items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-300 rounded-full w-12 h-12"></div>
              <div>
                <h3 className="font-medium text-gray-900">Jane Smith</h3>
                <p className="text-gray-500 text-sm">Consultation</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="font-medium text-gray-900 text-sm">
                2023-06-12 at 2:30 PM
              </p>
              <div className="mt-1">
                <span className="bg-yellow-100 px-2 py-1 rounded-full text-yellow-800 text-xs">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentsContent;
