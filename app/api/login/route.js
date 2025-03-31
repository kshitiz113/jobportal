import db from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = "your_secret_key"; // Change this to a strong secret key

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing email, password, or role" }), { status: 400 });
    }

    if (!["job_seeker", "employer", "admin"].includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role. Must be job_seeker, employer, or admin" }), { status: 400 });
    }

    // Check if the user exists
    const [user] = await db.query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role]);

    if (user.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid email, password, or role" }), { status: 400 });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return new Response(JSON.stringify({ error: "Invalid email, password, or role" }), { status: 400 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user[0].id, role: user[0].role }, SECRET_KEY, { expiresIn: "1h" });

    // Store the token & email in an HTTP-only cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    cookies().set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    return new Response(JSON.stringify({ message: "Login successful", role: user[0].role }), { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
