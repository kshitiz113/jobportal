import { parse } from "cookie";
import db from "@/lib/db";

export async function GET(req) {
  try {
    // Parse the cookies from the request header
    const cookies = parse(req.headers.get("cookie") || "");

    // Get the user_email from the cookies
    const email = cookies.user_email;

    // Check if the user_email cookie is not present
    if (!email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Fetch all jobs applied by this user from the database
    const [jobs] = await db.query(
      "SELECT job_title, company_name, applied_at FROM job_applied WHERE email = ?",
      [email]
    );

    // Return the fetched jobs
    return new Response(JSON.stringify({ jobs }), { status: 200 });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
