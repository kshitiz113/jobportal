import db from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const email = await cookieStore.get("user_email")?.value;
    const token = await cookieStore.get("auth_token")?.value;

    if (!email || !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get applications for jobs posted by this employer
    const [applications] = await db.query(`
      SELECT 
        ja.id,
        ja.email AS applicant_email,
        ja.resume_path,
        ja.applied_at,
        ja.job_title,
        ja.company_name,
        ja.job_id,
        j.title AS job_title,
        j.company,
        u.name AS applicant_name,
        q.id AS quiz_id
      FROM job_applied ja
      JOIN jobs j ON ja.job_id = j.id
      JOIN users u ON ja.email = u.email
      LEFT JOIN quizzes q ON q.job_id = j.id
      WHERE j.email = ?
      ORDER BY ja.applied_at DESC
    `, [email]);

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { action } = await request.json();

    const cookieStore = cookies();
    const email = await cookieStore.get("user_email")?.value;
    const token = await cookieStore.get("auth_token")?.value;

    if (!email || !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the employer owns this application
    const [application] = await db.query(`
      SELECT ja.id FROM job_applied ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.id = ? AND j.email = ?
    `, [id, email]);

    if (application.length === 0) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // For your schema, you might need to add a status field to job_applied
    // or create a separate application_status table
    return NextResponse.json(
      { error: "Status update not implemented in current schema" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}