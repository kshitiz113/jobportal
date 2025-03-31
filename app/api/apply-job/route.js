import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import multer from "multer";
import fs from "fs";
import path from "path";

// MySQL Connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "job",
});

// Configure Multer for file upload
const upload = multer({ dest: "public/resumes/" });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");
    const jobId = formData.get("jobId");

    if (!file) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    // Move file to public/resumes/
    const tempPath = file.filepath;
    const newPath = path.join(process.cwd(), "public/resumes", file.originalname);
    fs.renameSync(tempPath, newPath);

    // Insert application into MySQL
    await pool.execute(
      "INSERT INTO applications (job_id, resume_path) VALUES (?, ?)",
      [jobId, `/resumes/${file.originalname}`]
    );

    return NextResponse.json({ success: true, message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Failed to apply for job" }, { status: 500 });
  }
}
