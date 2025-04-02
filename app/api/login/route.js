import db from "@/lib/db";  // Database connection import
import bcrypt from "bcryptjs";  // For password hashing comparison
import jwt from "jsonwebtoken";  // For generating JWT token
import { cookies } from "next/headers";  // For setting HTTP-only cookies

const SECRET_KEY = "your_secret_key"; // Replace with a secure key in production

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    // Check for missing required fields
    if (!email || !password || !role) {
      return new Response(
        JSON.stringify({ error: "Missing email, password, or role" }),
        { status: 400 }
      );
    }

    // Check for valid role
    if (!["job_seeker", "employer", "admin"].includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be job_seeker, employer, or admin" }),
        { status: 400 }
      );
    }

    // Query to check if the user exists with the provided email and role
    const [user] = await db.query(
      "SELECT * FROM users WHERE email = ? AND role = ?",
      [email, role]
    );

    if (user.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid email, password, or role" }),
        { status: 400 }
      );
    }

    // Compare password hash
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return new Response(
        JSON.stringify({ error: "Invalid email, password, or role" }),
        { status: 400 }
      );
    }

    // Generate JWT token with user ID and role
    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Set the JWT token in an HTTP-only cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  // Secure cookie in production
      maxAge: 3600,  // Token expiration (1 hour)
      path: "/",
    });

    // Set email in an HTTP-only cookie
    cookies().set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  // Secure cookie in production
      maxAge: 3600,  // Cookie expiration (1 hour)
      path: "/",
    });

    return new Response(
      JSON.stringify({ message: "Login successful", role: user[0].role }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
