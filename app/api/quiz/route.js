import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

export async function POST(req) {
  try {
    // Authentication
    const cookieStore = cookies();
    const email = await cookieStore.get("user_email")?.value;
    const token = await cookieStore.get("auth_token")?.value;

    if (!email || !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
      if (!decoded?.id) {
        return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
      }
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get quiz data
    const { title, description, questions, jobId } = await req.json();

    // Validate input
    if (!title || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Title and at least one question are required" },
        { status: 400 }
      );
    }

    // Start transaction
    await db.query("START TRANSACTION");

    try {
      // Insert quiz metadata
      const [quizResult] = await db.query(
        "INSERT INTO quizzes (title, description, employer_id, job_id) VALUES (?, ?, ?, ?)",
        [title, description, decoded.id, jobId || null]
      );

      const quizId = quizResult.insertId;

      // Insert questions and options
      for (const question of questions) {
        const [questionResult] = await db.query(
          "INSERT INTO quiz_questions (quiz_id, question_text) VALUES (?, ?)",
          [quizId, question.text]
        );

        const questionId = questionResult.insertId;

        // Validate at least one correct option
        const hasCorrectOption = question.options.some(opt => opt.isCorrect);
        if (!hasCorrectOption) {
          throw new Error("Each question must have at least one correct option");
        }

        for (const option of question.options) {
          await db.query(
            "INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES (?, ?, ?)",
            [questionId, option.text, option.isCorrect ? 1 : 0]
          );
        }
      }

      await db.query("COMMIT");
      return NextResponse.json({ quizId }, { status: 201 });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Quiz creation error:", error);
      return NextResponse.json(
        { error: error.message || "Quiz creation failed" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error in quiz creation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const email = await cookieStore.get("user_email")?.value;
    const token = await cookieStore.get("auth_token")?.value;

    if (!email || !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get employer's user ID
    const [user] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get quizzes created by this employer
    const [quizzes] = await db.query(`
      SELECT q.id, q.title, q.description, q.created_at, 
             COUNT(DISTINCT qt.id) AS question_count,
             COUNT(DISTINCT s.id) AS submission_count
      FROM quizzes q
      LEFT JOIN quiz_questions qt ON q.id = qt.quiz_id
      LEFT JOIN quiz_submissions s ON q.id = s.quiz_id
      WHERE q.employer_id = ?
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `, [user[0].id]);

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}