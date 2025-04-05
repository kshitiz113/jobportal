// app/api/chat/route.js
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get('recipientId');
    
    const cookieStore = cookies();
    const email = await cookieStore.get('user_email')?.value;
    
    if (!email || !recipientId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    connection = await db.getConnection();

    // Get current user ID
    const [user] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user[0].id;

    // Get messages between these users
    const [messages] = await connection.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND recipient_id = ?)
       OR (sender_id = ? AND recipient_id = ?)
       ORDER BY created_at ASC`,
      [userId, recipientId, recipientId, userId]
    );

    return NextResponse.json({ messages });

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

export async function POST(request) {
  let connection;
  try {
    const { recipientId, content } = await request.json();
    
    const cookieStore = cookies();
    const email = await cookieStore.get('user_email')?.value;
    
    if (!email || !recipientId || !content) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    connection = await db.getConnection();

    // Get current user ID
    const [user] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user[0].id;

    // Save message
    await connection.query(
      `INSERT INTO messages 
       (sender_id, recipient_id, content) 
       VALUES (?, ?, ?)`,
      [userId, recipientId, content]
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