import db from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const email = await cookieStore.get('user_email')?.value;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get quizzes for jobs the user has applied to
    const [quizzes] = await db.query(`
      SELECT 
        q.id,
        q.title,
        q.description,
        COUNT(qt.id) AS question_count,
        j.title AS job_title,
        j.company AS company_name
      FROM quizzes q
      JOIN jobs j ON q.job_id = j.id
      JOIN quiz_questions qt ON q.id = qt.quiz_id
      WHERE q.id IN (
        SELECT q.id 
        FROM quizzes q
        JOIN jobs j ON q.job_id = j.id
        JOIN job_applied ja ON j.id = ja.job_id
        WHERE ja.email = ?
      )
      GROUP BY q.id
    `, [email]);

    return NextResponse.json({ quizzes });

  } catch (error) {
    console.error('Error fetching available quizzes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}