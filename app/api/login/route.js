import db from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    // Check for missing required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Missing email, password, or role" },
        { status: 400 }
      );
    }

    // Check for valid role
    if (!["job_seeker", "employer", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be job_seeker, employer, or admin" },
        { status: 400 }
      );
    }

    // Query to check if the user exists
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND role = ?",
      [email, role]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid email, password, or role" },
        { status: 400 }
      );
    }

    const user = users[0];

    // Compare password hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email, password, or role" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Set cookies
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    cookies().set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    return NextResponse.json(
      { message: "Login successful", role: user.role },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}