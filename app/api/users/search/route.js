// app/api/users/search/route.js
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query required' },
        { status: 400 }
      );
    }

    connection = await db.getConnection();

    const [users] = await connection.query(
      "SELECT id, name, email FROM users WHERE name LIKE ? OR email LIKE ? LIMIT 10",
      [`%${query}%`, `%${query}%`]
    );

    return NextResponse.json({ users });

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