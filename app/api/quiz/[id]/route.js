import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Get quiz details
    const [quiz] = await db.query(
      `SELECT id, title, description FROM quizzes WHERE id = ?`,
      [id]
    );

    if (quiz.length === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Get questions
    const [questions] = await db.query(
      `SELECT id, question_text AS text FROM quiz_questions WHERE quiz_id = ?`,
      [id]
    );

    // Get options for each question
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const [options] = await db.query(
          `SELECT id, option_text AS text FROM quiz_options WHERE question_id = ?`,
          [question.id]
        );
        return { ...question, options };
      })
    );

    return NextResponse.json({
      quiz: {
        ...quiz[0],
        questions: questionsWithOptions
      }
    });

  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}