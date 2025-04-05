// app/api/notifications/route.js
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

    const [notifications] = await connection.query(
      `SELECT * FROM notifications 
       WHERE user_email = ? 
       ORDER BY created_at DESC 
       LIMIT 100`,
      [email]
    );

    const [unread] = await connection.query(
      `SELECT COUNT(*) AS count FROM notifications 
       WHERE user_email = ? AND is_read = 0`,
      [email]
    );

    return NextResponse.json({
      notifications,
      unreadCount: unread[0].count
    });

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

export async function PUT() {
  let connection;
  try {
    const cookieStore = cookies();
    const email = await cookieStore.get('user_email')?.value;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    connection = await db.getConnection();

    await connection.query(
      `UPDATE notifications 
       SET is_read = 1 
       WHERE user_email = ? AND is_read = 0`,
      [email]
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