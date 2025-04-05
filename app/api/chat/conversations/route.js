import db from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET handler (for fetching conversations)
export async function GET() {
  let connection;
  try {
    const cookieStore = cookies();
    const email = cookieStore.get('user_email')?.value;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Get all conversations for the user
    const [conversations] = await connection.query(
      `SELECT 
        u.id as userId,
        u.name,
        u.email,
        (SELECT COUNT(*) FROM messages 
         WHERE recipient_id = ? AND sender_id = u.id AND is_read = FALSE) as unreadCount,
        (SELECT content FROM messages 
         WHERE (sender_id = u.id AND recipient_id = ?) 
         OR (sender_id = ? AND recipient_id = u.id)
         ORDER BY created_at DESC LIMIT 1) as lastMessage
       FROM users u
       WHERE u.id IN (
         SELECT DISTINCT sender_id FROM messages WHERE recipient_id = ?
         UNION
         SELECT DISTINCT recipient_id FROM messages WHERE sender_id = ?
       ) AND u.id != ?`,
      [userId, userId, userId, userId, userId, userId]
    );

    return NextResponse.json({ conversations });

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

// POST handler (for creating new conversations)
export async function POST(request) {
  let connection;
  try {
    const cookieStore = cookies();
    const email = cookieStore.get('user_email')?.value;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId } = await request.json();
    if (!recipientId) {
      return NextResponse.json(
        { error: 'Recipient ID is required' },
        { status: 400 }
      );
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

    // Check if conversation already exists
    const [existing] = await connection.query(
      `SELECT u.id as userId, u.name, u.email
       FROM users u
       WHERE u.id = ? AND u.id IN (
         SELECT DISTINCT sender_id FROM messages WHERE recipient_id = ?
         UNION
         SELECT DISTINCT recipient_id FROM messages WHERE sender_id = ?
       )`,
      [recipientId, userId, userId]
    );

    // If conversation exists, return it
    if (existing.length > 0) {
      return NextResponse.json({
        conversation: {
          userId: existing[0].userId,
          name: existing[0].name,
          email: existing[0].email,
          unreadCount: 0,
          lastMessage: null
        }
      });
    }

    // Get recipient info for new conversation
    const [recipient] = await connection.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [recipientId]
    );

    if (recipient.length === 0) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      conversation: {
        userId: recipient[0].id,
        name: recipient[0].name,
        email: recipient[0].email,
        unreadCount: 0,
        lastMessage: null
      }
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