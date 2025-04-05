import db from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dotenv from "dotenv";
import { Cookie } from "next/font/google";
dotenv.config();


export async function POST(req) {
  const SECRET_KEY = process.env.SECRET_KEY;

  if (!SECRET_KEY) {
    console.error("❌ SECRET_KEY is missing!");
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();
    // console.log(currentPassword, newPassword)

    // ✅ Correctly await `cookies()`
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Please log in." }),
        { status: 401 }
      );
    }

    console.log("🔹 Token received:", token);

    // ✅ Verify JWT token correctly
    let decoded;
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
console.log("🔹 Full Decoded Token:", decoded);


    } catch (err) {
      console.error("❌ JWT Verification Failed:", err.message);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token. Please log in again." }),
        { status: 403 }
      );
    } 

    const userEmail = await cookies().get("user_email")?.value;
    console.log(userEmail);

    // const userEmail = decoded.email;
    // console.log("🔹 User email from token:", userEmail);

    // ✅ Validate inputs
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

    // ✅ Fetch user
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [userEmail]);
    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    const user = users[0];

    // ✅ Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Current password is incorrect" }),
        { status: 400 }
      );
    }

    // ✅ Hash new password & update database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, userEmail]);

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error updating password:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
