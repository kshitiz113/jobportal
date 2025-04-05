import { parse } from "cookie";
import db from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const email = cookies.user_email;

    if (!email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const formData = await req.formData();
    const jobTitle = formData.get("jobTitle");
    const companyName = formData.get("companyName");
    const jobId = formData.get("jobId"); // Extract jobId properly
    const resumeFile = formData.get("resume");

    if (!jobTitle || !companyName || !jobId || !resumeFile) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    // Generate file name and path
    const fileExt = resumeFile.name.split(".").pop();
    const fileName = `${email}_${Date.now()}.${fileExt}`;
    const filePath = path.join(process.cwd(), "public/uploads/resumes", fileName);

    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Save file to server
    const buffer = await resumeFile.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Store file path in database
    const resumeUrl = `/uploads/resumes/${fileName}`;

    await db.query(
      "INSERT INTO job_applied (email, job_title, company_name, resume_path, job_id) VALUES (?, ?, ?, ?, ?)",
      [email, jobTitle, companyName, resumeUrl, jobId] // jobId included properly
    );

    return new Response(JSON.stringify({ message: "Application submitted successfully", resumeUrl }), { status: 200 });
  } catch (error) {
    console.error("Error applying for job:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
