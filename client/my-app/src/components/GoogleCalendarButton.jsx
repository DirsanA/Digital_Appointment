import React from 'react';
import { FaCalendarPlus } from 'react-icons/fa';

const GoogleCalendarButton = ({ appointment }) => {
  const addToGoogleCalendar = () => {
    try {
      // Get the date and time from appointment data
      const appointmentDate = appointment.date || appointment.appointment_date;
      const appointmentTime = appointment.time || appointment.appointment_time;

      console.log('Raw Appointment Data:', { appointmentDate, appointmentTime }); // Debug log

      if (!appointmentDate || !appointmentTime) {
        throw new Error('Appointment date or time is missing');
      }

      // Parse the date and time
      let year, month, day, hours, minutes;

      try {
        // Handle date format YYYY-MM-DD
        const dateParts = appointmentDate.split('-');
        console.log('Date parts:', dateParts); // Debug log

        if (dateParts.length !== 3) {
          throw new Error('Invalid date format. Expected YYYY-MM-DD');
        }

        // Ensure all date parts are valid numbers
        year = parseInt(dateParts[0], 10);
        month = parseInt(dateParts[1], 10);
        day = parseInt(dateParts[2], 10);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          console.error('Invalid date parts:', { year, month, day });
          throw new Error('Invalid date format. Please ensure date is in YYYY-MM-DD format');
        }

        // Handle different time formats
        let timeStr = appointmentTime.toString().trim();
        console.log('Time string:', timeStr); // Debug log
        
        // Remove any AM/PM indicators and convert to 24-hour format
        const isPM = timeStr.toLowerCase().includes('pm');
        timeStr = timeStr.replace(/[ap]m/i, '').trim();
        
        // Handle different time separators
        let timeParts;
        if (timeStr.includes(':')) {
          timeParts = timeStr.split(':');
        } else if (timeStr.includes(' ')) {
          timeParts = timeStr.split(' ');
        } else {
          // Handle "HHmm" format
          timeStr = timeStr.padStart(4, '0');
          timeParts = [timeStr.substring(0, 2), timeStr.substring(2, 4)];
        }

        console.log('Time parts:', timeParts); // Debug log

        if (timeParts.length < 2) {
          throw new Error('Invalid time format');
        }

        hours = parseInt(timeParts[0], 10);
        minutes = parseInt(timeParts[1], 10);

        if (isNaN(hours) || isNaN(minutes)) {
          throw new Error('Invalid time values');
        }
        
        // Convert to 24-hour format if needed
        if (isPM && hours < 12) {
          hours += 12;
        } else if (!isPM && hours === 12) {
          hours = 0;
        }

      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error(`Failed to parse date/time: ${parseError.message}`);
      }

      // Validate ranges
      if (year < 2000 || year > 2100) throw new Error('Invalid year');
      if (month < 1 || month > 12) throw new Error('Invalid month');
      if (day < 1 || day > 31) throw new Error('Invalid day');
      if (hours < 0 || hours > 23) throw new Error('Invalid hour');
      if (minutes < 0 || minutes > 59) throw new Error('Invalid minute');

      console.log('Parsed values:', { year, month, day, hours, minutes }); // Debug log

      // Create start date object (month is 0-based in JavaScript Date)
      const startDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      
      // Validate the date
      if (isNaN(startDate.getTime())) {
        console.error('Invalid date object:', startDate);
        throw new Error('Invalid date value');
      }

      // Set end time to 1 hour after start time
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      // Format dates for Google Calendar URL (YYYYMMDDTHHMMSSZ format)
      const formatDate = (date) => {
        const pad = (num) => String(num).padStart(2, '0');
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1);
        const day = pad(date.getUTCDate());
        const hours = pad(date.getUTCHours());
        const minutes = pad(date.getUTCMinutes());
        const seconds = pad(date.getUTCSeconds());
        
        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
      };

      // Create calendar event details
      const eventDetails = {
        text: `Medical Appointment with ${appointment.doctor || appointment.doctorfullname}`,
        dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
        details: `
          Department: ${appointment.department}
          Doctor: Dr ${appointment.doctor || appointment.doctorfullname}
          Patient: ${appointment.patientName || appointment.patient_name}
          Location: Hospital Medical Center
        `.trim(),
        location: 'Hospital Medical Center'
      };

      console.log('Event Details:', eventDetails); // Debug log

      // Construct Google Calendar URL
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${encodeURIComponent(eventDetails.dates)}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}`;

      // Open Google Calendar in new window
      window.open(googleCalendarUrl, '_blank');
    } catch (error) {
      console.error('Error adding to Google Calendar:', error);
      alert(`Error: ${error.message}`);
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