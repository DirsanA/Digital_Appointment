import React from "react";

const PatientsContent = () => {
  // Sample patient data
  const patients = [
    {
      id: 1,
      name: "John Doe",
      age: 42,
      gender: "Male",
      lastVisit: "2023-06-10",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 35,
      gender: "Female",
      lastVisit: "2023-06-05",
      status: "Active",
    },
    {
      id: 3,
      name: "Robert Johnson",
      age: 58,
      gender: "Male",
      lastVisit: "2023-05-28",
      status: "Inactive",
    },
  ];

  return (
    <>
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center space-y-3 md:space-y-0">
        <h1 className="font-bold text-gray-800 text-2xl md:text-3xl">
          My Patients
        </h1>
        <div className="bg-white shadow-md px-4 md:px-6 py-2 md:py-3 rounded-lg w-full md:w-auto">
          <span className="text-gray-500 text-xs md:text-sm">
            Total Patients
          </span>
          <p className="font-semibold text-gray-700 text-md md:text-lg">
            {patients.length}
          </p>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white shadow-md mt-6 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="divide-y divide-gray-200 min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-300 mr-3 rounded-full w-8 h-8"></div>
                      <div className="font-medium text-gray-900 text-sm">
                        {patient.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        patient.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PatientsContent;
