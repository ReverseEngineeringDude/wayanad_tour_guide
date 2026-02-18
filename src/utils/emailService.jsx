// src/utils/emailService.js
import emailjs from '@emailjs/browser';

// REPLACE THESE WITH YOUR ACTUAL KEYS FROM EMAILJS DASHBOARD
const SERVICE_ID = "service_plcewo6";
const TEMPLATE_ID = "template_t8egk9w";
const PUBLIC_KEY = "cy6_07W5P3it0mkBH";

export const sendApprovalEmail = async (bookingDetails) => {
  try {
    const templateParams = {
      user_name: bookingDetails.touristName,
      user_email: bookingDetails.touristEmail, // Ensure you save tourist email in booking
      guide_name: bookingDetails.guideName,
      place_name: bookingDetails.placeName,
      date: bookingDetails.date,
      time: bookingDetails.time,
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('Email sent successfully!', response.status, response.text);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};