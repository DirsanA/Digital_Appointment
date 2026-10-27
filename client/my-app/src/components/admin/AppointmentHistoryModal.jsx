import {
  FaTimes,
  FaNotesMedical,
  FaPrescriptionBottle,
  FaPills,
  FaCalendarAlt,
  FaHistory,
  FaPrint,
  FaDownload,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const HOSPITAL_NAME = "Digital Appointment Medical Center";
const HOSPITAL_ADDRESS = "Bahir Dar, Keble 03";
const HOSPITAL_PHONE = "+251 907 412 708";
const HOSPITAL_EMAIL = "dirsanantehun739@gmail.com";

const AppointmentHistoryModal = ({
  showModal,
  selectedAppointment,
  onClose,
  isLoading = false,
}) => {
  if (!showModal || !selectedAppointment) return null;

  // Use the correct property names from your data structure
  const patientName =
    selectedAppointment.patient_name ||
    selectedAppointment.patientName ||
    "N/A";
  const doctorName =
    selectedAppointment.doctorfullname || selectedAppointment.doctor || "N/A";
  const department = selectedAppointment.department || "N/A";
  const appointmentTime =
    selectedAppointment.time || selectedAppointment.appointment_time || "N/A";

  const handlePrintSingleRecord = (record) => {
    const printWindow = window.open("", "_blank");

    if (!record) {
      printWindow.document.write(`
        <html>
          <head>
            <title>No History Found</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
              .message { margin-top: 50px; color: #666; }
            </style>
          </head>
          <body>
            <div class="message">
              <h2>No history found for this record</h2>
              <p>Please try again later.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      return;
    }

    const appointmentDate = record.appointment_date || record.created_at;

    const printContent = `
      <html>
        <head>
          <title>Medical History - ${patientName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
            .hospital-info { margin-bottom: 20px; }
            .hospital-name { font-size: 24px; font-weight: bold; color: #2563eb; margin: 10px 0; }
            .hospital-details { color: #666; font-size: 14px; }
            .record { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            .record-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; color: #333; margin-bottom: 5px; }
            .section-content { background: #f5f5f5; padding: 10px; border-radius: 4px; }
            .medication-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .medication-item { margin-bottom: 10px; }
            .medication-label { color: #666; font-size: 0.9em; }
            .next-appointment { margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; }
            .patient-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .patient-info p { margin: 5px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
            .appointment-date { font-size: 18px; color: #2563eb; margin: 20px 0; text-align: center; }
            .record-time { color: #666; font-size: 14px; }
            @media print {
              body { padding: 0; }
              .record { break-inside: avoid; }
              .logo { max-width: 120px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hospital-info">
              <div class="hospital-name">${HOSPITAL_NAME}</div>
              <div class="hospital-details">
                ${HOSPITAL_ADDRESS}<br>
                Phone: ${HOSPITAL_PHONE}<br>
                Email: ${HOSPITAL_EMAIL}
              </div>
            </div>
            <h1 style="margin: 0;">Medical History</h1>
            <div class="appointment-date">
              Appointment Date: ${new Date(appointmentDate).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </div>
          </div>
          
          <div class="patient-info">
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Appointment Time:</strong> ${appointmentTime}</p>
            <p><strong>Record Created:</strong> ${new Date(
              record.created_at
            ).toLocaleString()}</p>
          </div>

          <div class="record">
            <div class="record-header">
              <h3>Medical Record</h3>
              <span class="record-time">Created: ${new Date(
                record.created_at
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>
            
            <div class="section">
              <div class="section-title">Diagnosis</div>
              <div class="section-content">${
                record.diagnosis || "No diagnosis recorded"
              }</div>
            </div>
            
            <div class="section">
              <div class="section-title">Prescription</div>
              <div class="section-content">${
                record.prescription || "No prescription recorded"
              }</div>
            </div>
            
            ${
              record.medicine_name
                ? `
              <div class="section">
                <div class="section-title">Medication</div>
                <div class="section-content">
                  <div class="medication-grid">
                    <div class="medication-item">
                      <div class="medication-label">Name</div>
                      <div>${record.medicine_name}</div>
                    </div>
                    <div class="medication-item">
                      <div class="medication-label">Dosage</div>
                      <div>${record.medicine_dosage}</div>
                    </div>
                    <div class="medication-item">
                      <div class="medication-label">Frequency</div>
                      <div>${record.medicine_frequency}</div>
                    </div>
                    <div class="medication-item">
                      <div class="medication-label">Duration</div>
                      <div>${record.medicine_duration}</div>
                    </div>
                  </div>
                </div>
              </div>
            `
                : ""
            }
            
            ${
              record.next_appointment_date
                ? `
              <div class="next-appointment">
                <div class="section-title">Next Appointment</div>
                <div>${new Date(
                  record.next_appointment_date
                ).toLocaleDateString()} at ${record.next_appointment_time}</div>
              </div>
            `
                : ""
            }
          </div>

          <div class="footer">
            <p>This document was generated by ${HOSPITAL_NAME}</p>
            <p>For any queries, please contact us at ${HOSPITAL_EMAIL}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownloadSingleRecord = async (record) => {
    const doc = new jsPDF();
    const appointmentDate = record.appointment_date || record.created_at;

    try {
      // Add hospital info
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text(HOSPITAL_NAME, 105, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(102, 102, 102);
      doc.text(HOSPITAL_ADDRESS, 105, 27, { align: "center" });
      doc.text(`Phone: ${HOSPITAL_PHONE}`, 105, 34, { align: "center" });
      doc.text(`Email: ${HOSPITAL_EMAIL}`, 105, 41, { align: "center" });

      // Add header text
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text("Medical History", 105, 55, { align: "center" });

      // Add appointment date
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text(
        `Appointment Date: ${new Date(appointmentDate).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}`,
        105,
        65,
        { align: "center" }
      );

      // Add patient info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Patient: ${patientName}`, 20, 80);
      doc.text(`Doctor: ${doctorName}`, 20, 87);
      doc.text(`Department: ${department}`, 20, 94);
      doc.text(`Appointment Time: ${appointmentTime}`, 20, 101);
      doc.text(
        `Record Created: ${new Date(record.created_at).toLocaleString()}`,
        20,
        108
      );

      let yPosition = 120;

      // Add record content
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Medical Record", 20, yPosition);
      yPosition += 10;

      // Diagnosis
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("Diagnosis:", 20, yPosition);
      yPosition += 7;
      doc.setFont(undefined, "normal");
      doc.text(record.diagnosis || "No diagnosis recorded", 20, yPosition);
      yPosition += 15;

      // Prescription
      doc.setFont(undefined, "bold");
      doc.text("Prescription:", 20, yPosition);
      yPosition += 7;
      doc.setFont(undefined, "normal");
      doc.text(
        record.prescription || "No prescription recorded",
        20,
        yPosition
      );
      yPosition += 15;

      // Medication
      if (record.medicine_name) {
        doc.setFont(undefined, "bold");
        doc.text("Medication:", 20, yPosition);
        yPosition += 7;
        doc.setFont(undefined, "normal");

        const medicationData = [
          ["Name", record.medicine_name],
          ["Dosage", record.medicine_dosage],
          ["Frequency", record.medicine_frequency],
          ["Duration", record.medicine_duration],
        ];

        doc.autoTable({
          startY: yPosition,
          head: [["Property", "Value"]],
          body: medicationData,
          theme: "grid",
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20 },
        });

        yPosition = doc.lastAutoTable.finalY + 10;
      }

      // Next Appointment
      if (record.next_appointment_date) {
        doc.setFont(undefined, "bold");
        doc.text("Next Appointment:", 20, yPosition);
        yPosition += 7;
        doc.setFont(undefined, "normal");
        doc.text(
          `${new Date(record.next_appointment_date).toLocaleDateString()} at ${
            record.next_appointment_time
          }`,
          20,
          yPosition
        );
      }

      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(102, 102, 102);
      doc.text(
        `Generated by ${HOSPITAL_NAME}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );

      // Save the PDF
      doc.save(
        `medical_history_${patientName.replace(/\s+/g, "_")}_${
          new Date(record.created_at).toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center backdrop-blur-sm p-4">
      <div
        className="relative flex flex-col bg-gradient-to-br from-white to-blue-50 shadow-xl border border-blue-100 rounded-xl w-full max-w-2xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="top-0 z-10 sticky flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 p-4 border-b border-blue-500 rounded-t-xl">
          <div>
            <h2 className="font-bold text-white text-xl">Medical History</h2>
            <p className="text-blue-100 text-sm">
              {patientName} - {doctorName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-blue-500 p-1.5 rounded-full text-white hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="border-b-2 border-blue-600 rounded-full w-8 h-8 animate-spin"></div>
            </div>
          ) : !selectedAppointment.history?.length ? (
            <div className="py-8 text-gray-500 text-center">
              No history found for this appointment
            </div>
          ) : (
            <div className="space-y-4">
              {selectedAppointment.history.map((record, index) => (
                <div
                  key={index}
                  className="bg-white shadow-sm hover:shadow-md p-4 border border-blue-100 rounded-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold text-blue-800">
                        {new Date(record.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </h3>
                      <p className="text-blue-600 text-sm">
                        {new Date(record.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrintSingleRecord(record)}
                        className="inline-flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1.5 border border-blue-200 rounded-lg text-blue-700 transition-colors"
                        title="Print Record"
                      >
                        <FaPrint className="mr-2" />
                        <span className="text-sm">Print</span>
                      </button>
                      <button
                        onClick={() => handleDownloadSingleRecord(record)}
                        className="inline-flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1.5 border border-blue-200 rounded-lg text-blue-700 transition-colors"
                        title="Download PDF"
                      >
                        <FaDownload className="mr-2" />
                        <span className="text-sm">Download</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="flex items-center mb-2 font-medium text-blue-800">
                        <FaNotesMedical className="mr-2 text-blue-600" />
                        Diagnosis
                      </h4>
                      <p className="bg-blue-50 p-3 border border-blue-100 rounded text-gray-700">
                        {record.diagnosis || "No diagnosis recorded"}
                      </p>
                    </div>

                    <div>
                      <h4 className="flex items-center mb-2 font-medium text-blue-800">
                        <FaPrescriptionBottle className="mr-2 text-blue-600" />
                        Prescription
                      </h4>
                      <p className="bg-blue-50 p-3 border border-blue-100 rounded text-gray-700">
                        {record.prescription || "No prescription recorded"}
                      </p>
                    </div>

                    {record.medicine_name && (
                      <div>
                        <h4 className="flex items-center mb-2 font-medium text-blue-800">
                          <FaPills className="mr-2 text-blue-600" />
                          Medication
                        </h4>
                        <div className="gap-4 grid grid-cols-2 bg-blue-50 p-3 border border-blue-100 rounded">
                          <div>
                            <p className="text-blue-600 text-sm">Name</p>
                            <p className="text-gray-700">
                              {record.medicine_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-600 text-sm">Dosage</p>
                            <p className="text-gray-700">
                              {record.medicine_dosage}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-600 text-sm">Frequency</p>
                            <p className="text-gray-700">
                              {record.medicine_frequency}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-600 text-sm">Duration</p>
                            <p className="text-gray-700">
                              {record.medicine_duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {record.next_appointment_date && (
                      <div>
                        <h4 className="flex items-center mb-2 font-medium text-blue-800">
                          <FaCalendarAlt className="mr-2 text-blue-600" />
                          Next Appointment
                        </h4>
                        <p className="bg-blue-50 p-3 border border-blue-100 rounded text-gray-700">
                          {new Date(
                            record.next_appointment_date
                          ).toLocaleDateString()}{" "}
                          at {record.next_appointment_time}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistoryModal;
