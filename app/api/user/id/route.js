// app/api/user/id/route.js
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  let connection;
  try {
    const cookieStore = cookies();
    const email = await cookieStore.get('user_email')?.value;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    connection = await db.getConnection();

    const [user] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ userId: user[0].id });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}