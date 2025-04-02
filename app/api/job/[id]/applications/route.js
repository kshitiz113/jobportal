import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    const jobId = params?.id;
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Fetch employer's email from cookies
    const userEmail = cookies().get("userEmail")?.value;
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the logged-in employer owns the job
    const job = await db.query("SELECT * FROM jobs WHERE id = ? AND email = ?", [jobId, userEmail]);

    if (!job.length) {
      return NextResponse.json({ error: "Job not found or unauthorized" }, { status: 403 });
    }

    // Fetch applications for the job
    const applications = await db.query(
      "SELECT applicants.name, applicants.email, applications.resume FROM applications " +
      "JOIN applicants ON applications.applicant_email = applicants.email WHERE applications.job_id = ?",
      [jobId]
    );

    return NextResponse.json({ applications });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications", details: error.message },
      { status: 500 }
    );
  }
}
