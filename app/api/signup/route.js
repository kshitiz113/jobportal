import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, confirmPassword, role } = await req.json();

    if (!name || !email || !password || !confirmPassword || !role) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), { status: 400 });
    }

    if (password !== confirmPassword) {
      return new Response(JSON.stringify({ error: "Passwords do not match" }), { status: 400 });
    }

    if (!["job_seeker", "employer"].includes(role)) {
      return new Response(JSON.stringify({ error: "Role must be job_seeker or employer" }), { status: 400 });
    }

    // Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: "Email already registered" }), { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
      name, email, hashedPassword, role
    ]);

    return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
