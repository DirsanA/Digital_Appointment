import React from 'react';
import { FaCalendarPlus } from 'react-icons/fa';

const GoogleCalendarButton = ({ appointment }) => {
  const addToGoogleCalendar = () => {
    try {
      // Format the date and time for Google Calendar URL
      const dateStr = new Date(appointment.date || appointment.appointment_date).toISOString().split('T')[0];
      const timeStr = appointment.time || appointment.appointment_time;
      
      // Convert time from HH:mm to proper format
      const [hours, minutes] = timeStr.split(':');
      const startDate = new Date(`${dateStr}T${timeStr}`);
      
      // Set end time to 1 hour after start time
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      
      // Create calendar event details
      const eventDetails = {
        text: `Medical Appointment with ${appointment.doctor || appointment.doctorfullname}`,
        dates: `${startDate.toISOString()}/${endDate.toISOString()}`,
        details: `
          Department: ${appointment.department}
          Doctor: Dr ${appointment.doctor || appointment.doctorfullname}
          Patient: ${appointment.patientName || appointment.patient_name}
          Location: Hospital Medical Center
        `.trim(),
        location: 'Hospital Medical Center'
      };

      // Construct Google Calendar URL
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${encodeURIComponent(eventDetails.dates.replace(/[-:]/g, ''))}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}`;

      // Open Google Calendar in new window
      window.open(googleCalendarUrl, '_blank');
    } catch (error) {
      console.error('Error adding to Google Calendar:', error);
      alert('There was an error adding the event to Google Calendar. Please try again.');
    }
  };

  return (
    <button
      onClick={addToGoogleCalendar}
      className="inline-flex items-center px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
      title="Add to Google Calendar"
    >
      <FaCalendarPlus className="mr-2" />
      <span className="text-sm">Add to Calendar</span>
    </button>
  );
};

export default GoogleCalendarButton; 