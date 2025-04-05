import { NextResponse } from "next/server";
import pool from "@/lib/db"; // MySQL database connection
import { cookies } from "next/headers"; // Import cookies to access user data

// Fetch job details by ID
export async function GET(req, { params }) {
  try {
    const id = params?.id; // Ensure `id` exists

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const [job] = await pool.execute("SELECT * FROM jobs WHERE id = ?", [id]);

    if (!job.length) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job: job[0] }); // Return first job
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job", details: error.message },
      { status: 500 }
    );
  }
}

// Post a new job listing (Employer)
export async function POST(req) {
  try {
    const { title, company, location, salary, description } = await req.json();

    // Get email from cookies
    const employerEmail = cookies().get("user_email")?.value;

    if (!employerEmail) {
      return NextResponse.json({ error: "User not logged in" }, { status: 401 });
    }

    // Ensure all required fields are provided
    if (!title || !company || !location || !salary || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const query = `
      INSERT INTO jobs (title, company, location, salary, description, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(query, [title, company, location, salary, description, employerEmail]);

    return NextResponse.json({ message: "Job posted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to post job" }, { status: 500 });
  }
}