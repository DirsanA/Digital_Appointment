import {
  FaTimes,
  FaNotesMedical,
  FaPrescriptionBottle,
  FaPills,
  FaCalendarAlt,
  FaHistory,
} from "react-icons/fa";

const AppointmentHistoryModal = ({
  showModal,
  selectedAppointment,
  onClose,
  isLoading = false,
}) => {
  if (!showModal || !selectedAppointment) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center backdrop-blur-sm p-4">
      <div
        className="relative flex flex-col bg-white shadow-xl border border-gray-200 rounded-xl w-full max-w-2xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="top-0 z-10 sticky flex justify-between items-center bg-white p-4 border-gray-200 border-b">
          <div>
            <h2 className="font-bold text-gray-800 text-xl">Medical History</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1.5 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="mb-4 border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
              <p className="text-gray-500">Loading history...</p>
            </div>
          ) : selectedAppointment.history?.length > 0 ? (
            <div className="space-y-4">
              {selectedAppointment.history.map((record) => (
                <div
                  key={record.id}
                  className="hover:shadow-sm p-4 border border-gray-200 rounded-lg transition-shadow"
                >
                  {/* Record Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-800">
                      {new Date(record.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h3>
                    <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-800 text-xs">
                      {new Date(record.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-3">
                    <div className="flex items-center mb-1 font-medium text-gray-700 text-sm">
                      <FaNotesMedical
                        className="mr-2 text-blue-500"
                        size={14}
                      />
                      Diagnosis
                    </div>
                    <div className="bg-blue-50 p-3 rounded text-sm">
                      {record.diagnosis || "No diagnosis recorded"}
                    </div>
                  </div>

                  {/* Prescription */}
                  <div className="mb-3">
                    <div className="flex items-center mb-1 font-medium text-gray-700 text-sm">
                      <FaPrescriptionBottle
                        className="mr-2 text-indigo-500"
                        size={14}
                      />
                      Prescription
                    </div>
                    <div className="bg-indigo-50 p-3 rounded text-sm">
                      {record.prescription || "No prescription recorded"}
                    </div>
                  </div>

                  {/* Medication */}
                  {record.medicine_name && (
                    <div className="mb-3">
                      <div className="flex items-center mb-1 font-medium text-gray-700 text-sm">
                        <FaPills className="mr-2 text-purple-500" size={14} />
                        Medication
                      </div>
                      <div className="bg-purple-50 p-3 rounded">
                        <div className="gap-2 grid grid-cols-2 text-sm">
                          <div>
                            <span className="text-gray-500 text-xs">Name</span>
                            <p>{record.medicine_name}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">
                              Dosage
                            </span>
                            <p>{record.medicine_dosage}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">
                              Frequency
                            </span>
                            <p>{record.medicine_frequency}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">
                              Duration
                            </span>
                            <p>{record.medicine_duration}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Appointment */}
                  {record.next_appointment_date && (
                    <div className="mt-3 pt-3 border-gray-200 border-t">
                      <div className="flex items-center mb-1 font-medium text-gray-700 text-sm">
                        <FaCalendarAlt
                          className="mr-2 text-green-500"
                          size={14}
                        />
                        Next Appointment
                      </div>
                      <div className="inline-flex items-center bg-green-50 px-3 py-1.5 rounded-full text-green-800 text-sm">
                        {new Date(
                          record.next_appointment_date
                        ).toLocaleDateString()}{" "}
                        at {record.next_appointment_time}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-12 text-center">
              <FaHistory className="mb-3 text-gray-300 text-4xl" />
              <h4 className="mb-1 font-medium text-gray-500 text-lg">
                No History Found
              </h4>
              <p className="max-w-xs text-gray-400">
                No medical records available for this appointment yet.
              </p>
            </div>
          )}
        </div>
        <div className="bottom-0 sticky flex justify-end bg-white p-3 border-gray-200 border-t">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistoryModal;
