import db from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const cookieStore = cookies();
    const token = await cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get quiz details
    const [quiz] = await db.query(
      'SELECT id, title, description FROM quizzes WHERE id = ?',
      [id]
    );

    if (quiz.length === 0) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Get all submissions for this quiz
    const [submissions] = await db.query(`
      SELECT 
        s.id,
        s.score,
        s.total_questions,
        s.submitted_at,
        u.name AS user_name,
        u.email AS user_email
      FROM quiz_submissions s
      JOIN users u ON s.user_id = u.id
      WHERE s.quiz_id = ?
      ORDER BY s.submitted_at DESC
    `, [id]);

    // Get answers for each submission
    const submissionsWithAnswers = await Promise.all(
      submissions.map(async (submission) => {
        const [answers] = await db.query(`
          SELECT 
            a.id,
            q.question_text,
            o.option_text,
            a.is_correct,
            (SELECT option_text FROM quiz_options WHERE question_id = q.id AND is_correct = 1 LIMIT 1) AS correct_answer
          FROM quiz_answers a
          JOIN quiz_questions q ON a.question_id = q.id
          JOIN quiz_options o ON a.option_id = o.id
          WHERE a.submission_id = ?
        `, [submission.id]);

        return {
          ...submission,
          answers
        };
      })
    );

    return NextResponse.json({
      quiz: quiz[0],
      submissions: submissionsWithAnswers
    });

  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}