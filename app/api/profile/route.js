import { parse } from 'cookie';
import db from '@/lib/db';

export async function GET(req) {
  try {
    const cookies = parse(req.headers.get('cookie') || '');
    const email = cookies.user_email;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const [result] = await db.query('SELECT * FROM profiles WHERE email = ?', [email]);

    if (result.length > 0) {
      return new Response(
        JSON.stringify({
          profileExists: true,
          profile: result[0],
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        profileExists: false,
        email,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookies = parse(req.headers.get('cookie') || '');
    const email = cookies.user_email;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { full_name, skills, course, college_name, tenth_percentage, twelfth_percentage, github_id } = await req.json();

    if (!full_name || !skills || !course || !college_name || tenth_percentage == null || twelfth_percentage == null) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    // Ensure percentages are within a valid range
    if (tenth_percentage < 0 || tenth_percentage > 100 || twelfth_percentage < 0 || twelfth_percentage > 100) {
      return new Response(JSON.stringify({ error: 'Percentages must be between 0 and 100' }), { status: 400 });
    }

    // Check if profile already exists
    const [existingProfile] = await db.query('SELECT id FROM profiles WHERE email = ?', [email]);

    if (existingProfile.length > 0) {
      return new Response(JSON.stringify({ error: 'Profile already exists' }), { status: 409 });
    }

    // Insert new profile into database
    await db.query(
      'INSERT INTO profiles (email, full_name, skills, course, college_name, tenth_percentage, twelfth_percentage, github_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [email, full_name, skills, course, college_name, tenth_percentage, twelfth_percentage, github_id]
    );

    return new Response(JSON.stringify({ message: 'Profile saved successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error saving profile:', error);
    return new Response(JSON.stringify({ error: 'Failed to save profile' }), { status: 500 });
  }
}
