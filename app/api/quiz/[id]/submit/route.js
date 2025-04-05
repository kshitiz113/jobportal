import db from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { answers } = await request.json();
    const cookieStore = cookies();
    const email = await cookieStore.get('user_email')?.value;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID
    const [user] = await db.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );
    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user[0].id;

    // Get all questions for the quiz
    const [questions] = await db.query(
      `SELECT id FROM quiz_questions WHERE quiz_id = ?`,
      [id]
    );
    const totalQuestions = questions.length;

    // Calculate score
    let score = 0;
    const answerRecords = [];

    for (const question of questions) {
      const optionId = answers[question.id];
      if (!optionId) continue;

      // Check if answer is correct
      const [isCorrect] = await db.query(
        `SELECT is_correct FROM quiz_options WHERE id = ?`,
        [optionId]
      );

      if (isCorrect.length > 0 && isCorrect[0].is_correct) {
        score++;
      }

      answerRecords.push({
        questionId: question.id,
        optionId,
        isCorrect: isCorrect[0]?.is_correct || false
      });
    }

    // Start transaction
    await db.query("START TRANSACTION");

    try {
      // Record submission
      const [submission] = await db.query(
        `INSERT INTO quiz_submissions 
        (quiz_id, user_id, score, total_questions) 
        VALUES (?, ?, ?, ?)`,
        [id, userId, score, totalQuestions]
      );
      const submissionId = submission.insertId;

      // Record answers
      for (const answer of answerRecords) {
        await db.query(
          `INSERT INTO quiz_answers 
          (submission_id, question_id, option_id, is_correct) 
          VALUES (?, ?, ?, ?)`,
          [submissionId, answer.questionId, answer.optionId, answer.isCorrect]
        );
      }

      await db.query("COMMIT");
      return NextResponse.json({ score, totalQuestions });

    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }

  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}