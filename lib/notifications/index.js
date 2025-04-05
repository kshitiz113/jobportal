// lib/notifications/index.js
import db from "@/lib/db";

/**
 * Enhanced notification sender with job details
 * @param {Object} params
 * @param {string} params.email - Recipient email
 * @param {string} params.message - Notification message
 * @param {string} [params.job_title] - Job title related to notification
 * @param {string} [params.company_name] - Company name related to notification
 * @param {string} [params.type] - Notification type (e.g., 'application_accepted')
 * @returns {Promise<boolean>} Returns true if successful
 */
export async function sendNotification({ 
  email, 
  message, 
  job_title = null, 
  company_name = null, 
  type = 'general' 
}) {
  try {
    console.log(`Notification for ${email}: ${message}`, 
      { job_title, company_name });
    
    // Store in database with job details
    await db.query(
      `INSERT INTO notifications 
       (user_email, message, type, job_title, company_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, message, type, job_title, company_name]
    );
    
    return true;
  } catch (error) {
    console.error("Notification error:", error);
    return false;
  }
}

/**
 * Example usage:
 * await sendNotification({
 *   email: 'user@example.com',
 *   message: 'Your application has been accepted',
 *   job_title: 'Software Engineer',
 *   company_name: 'Tech Corp',
 *   type: 'application_accepted'
 * });
 */