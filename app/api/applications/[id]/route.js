// app/api/applications/[id]/route.js
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { sendNotification } from "@/lib/notifications";

export async function POST(request, { params }) {
  let connection;
  try {
    const { id } = params;
    const { action } = await request.json();
    connection = await db.getConnection();

    // 1. Get application details
    const [application] = await connection.query(
      "SELECT ja.*, j.title as job_title, j.company as company_name FROM job_applied ja JOIN jobs j ON ja.job_id = j.id WHERE ja.id = ?",
      [id]
    );

    if (application.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // 2. Update application status
    await connection.query(
      "UPDATE job_applied SET status = ? WHERE id = ?",
      [action, id]
    );

    // 3. Get applicant details
    const [applicant] = await connection.query(
      "SELECT email, name FROM users WHERE email = ?",
      [application[0].email]
    );

    if (applicant.length > 0) {
      const message = action === "accepted" 
        ? `Congratulations! Your application has been shortlisted.` 
        : `Thank you for applying. Your application has been regected Pls try again.`;

      await sendNotification({
        email: applicant[0].email,
        message,
        type: `application_${action}`,
        job_title: application[0].job_title,
        company_name: application[0].company_name
      });
    }

    return NextResponse.json({ message: "Status updated" });

  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}