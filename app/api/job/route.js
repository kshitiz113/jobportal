import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Create MySQL connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "job",
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // Query to fetch jobs based on search input
    const query = `
      SELECT id, title, company
      FROM jobs
      WHERE title LIKE ? OR company LIKE ?
    `;

    const [rows] = await pool.execute(query, [`%${search}%`, `%${search}%`]);

    return NextResponse.json({ job: rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const { title, company, location, salary, description } = await req.json();
    const query = "INSERT INTO jobs (title, company, location, salary, description) VALUES (?, ?, ?, ?, ?)";
    await db.execute(query, [title, company, location, salary, description]);

    return NextResponse.json({ message: "Job posted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post job" }, { status: 500 });
  }
}
