// app/api/notifications/[id]/route.js
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  let connection;
  try {
    const { id } = params;
    connection = await db.getConnection();

    await connection.query(
      `UPDATE notifications 
       SET is_read = 1 
       WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ success: true });

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