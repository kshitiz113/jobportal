import db from "@/lib/db"; // MySQL connection
import bcrypt from "bcryptjs"; // Password hashing
import jwt from "jsonwebtoken"; // JWT handling
import { cookies } from "next/headers"; // Access cookies

const SECRET_KEY = process.env.SECRET_KEY; // Secure key

export async function POST(req) {
  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    // ✅ Await cookies before accessing them
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Please log in." }),
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid token. Please log in again." }),
        { status: 403 }
      );
    }

    const userEmail = decoded.email; // Extract email from token

    // Validate input fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return new Response(
        JSON.stringify({ error: "New passwords do not match" }),
        { status: 400 }
      );
    }

    // Fetch user from database using email
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [userEmail]);
    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    const user = users[0];

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Current password is incorrect" }),
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, userEmail]);

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating password:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
