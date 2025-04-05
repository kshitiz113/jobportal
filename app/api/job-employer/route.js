import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // ✅ Corrected import

// 🔐 Use SECRET_KEY from environment variables
const SECRET_KEY = process.env.SECRET_KEY;

export async function GET(req) {
  try {
    const cookieStore = cookies(); // ✅ Use cookies() directly
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token found" }, { status: 401 });
    }

    // ✅ Verify token using env-based secret
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
      console.log("Decoded JWT:", decoded); // Debugging
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    // ✅ Ensure the user is an employer
    if (decoded.role !== "employer") {
      return NextResponse.json({ error: "Forbidden: Only employers can access" }, { status: 403 });
    }

    const employerEmail = decoded.email;

    // ✅ Fetch jobs posted by the employer
    const [jobs] = await db.query("SELECT * FROM jobs WHERE email = ?", [employerEmail]);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
