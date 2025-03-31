import { NextResponse } from "next/server";
import db from "@/lib/db"; // Database connection

export async function GET(req, { params }) {
  try {
    const id = params?.id; // Ensure `id` exists

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const job = await db.query("SELECT * FROM jobs WHERE id = ?", [id]);

    if (!job.length) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job: job[0] }); // Return first job
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch job", details: error.message },
      { status: 500 }
    );
  }
}
