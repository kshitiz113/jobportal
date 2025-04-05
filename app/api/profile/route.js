import { parse } from 'cookie';
import db from '@/lib/db';

export async function GET(req) {
  try {
    const cookies = parse(req.headers.get('cookie') || '');
    const email = cookies.user_email;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const [result] = await db.query('SELECT * FROM profiles WHERE email = ?', [email]);

    return new Response(
      JSON.stringify({
        success: true,
        profileExists: result.length > 0,
        profile: result[0] || null,
        email
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal Server Error' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

export async function POST(req) {
  try {
    const cookies = parse(req.headers.get('cookie') || '');
    const email = cookies.user_email;

    if (!email) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Unauthorized' 
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    const { 
      full_name, 
      skills, 
      course, 
      college_name, 
      tenth_percentage, 
      twelfth_percentage, 
      github_id 
    } = await req.json();

    // Validate required fields
    const requiredFields = {
      full_name,
      skills,
      course,
      college_name,
      tenth_percentage,
      twelfth_percentage
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => value == null || value === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'All fields are required',
          missingFields
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Validate percentage ranges
    if (tenth_percentage < 0 || tenth_percentage > 100 || 
        twelfth_percentage < 0 || twelfth_percentage > 100) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Percentages must be between 0 and 100' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Check if profile exists to determine if we're updating or creating
    const [existingProfile] = await db.query(
      'SELECT id FROM profiles WHERE email = ?', 
      [email]
    );

    if (existingProfile.length > 0) {
      // Update existing profile
      await db.query(
        `UPDATE profiles SET 
          full_name = ?,
          skills = ?,
          course = ?,
          college_name = ?,
          tenth_percentage = ?,
          twelfth_percentage = ?,
          github_id = ?,
          updated_at = NOW()
        WHERE email = ?`,
        [
          full_name, 
          skills, 
          course, 
          college_name, 
          tenth_percentage, 
          twelfth_percentage, 
          github_id, 
          email
        ]
      );
    } else {
      // Create new profile
      await db.query(
        `INSERT INTO profiles 
          (email, full_name, skills, course, college_name, 
           tenth_percentage, twelfth_percentage, github_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          email, 
          full_name, 
          skills, 
          course, 
          college_name, 
          tenth_percentage, 
          twelfth_percentage, 
          github_id
        ]
      );
    }

    // Return the updated/created profile
    const [updatedProfile] = await db.query(
      'SELECT * FROM profiles WHERE email = ?', 
      [email]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: existingProfile.length > 0 
          ? 'Profile updated successfully' 
          : 'Profile created successfully',
        profile: updatedProfile[0]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error saving profile:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to save profile' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

export async function PATCH(req) {
  try {
    const cookies = parse(req.headers.get('cookie') || '');
    const email = cookies.user_email;

    if (!email) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Unauthorized' 
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    const updates = await req.json();

    // Check if profile exists
    const [existingProfile] = await db.query(
      'SELECT id FROM profiles WHERE email = ?', 
      [email]
    );

    if (existingProfile.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Profile not found' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Validate percentage ranges if they're being updated
    if (updates.tenth_percentage && (updates.tenth_percentage < 0 || updates.tenth_percentage > 100)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: '10th percentage must be between 0 and 100' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    if (updates.twelfth_percentage && (updates.twelfth_percentage < 0 || updates.twelfth_percentage > 100)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: '12th percentage must be between 0 and 100' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Build the update query dynamically based on provided fields
    const fieldsToUpdate = Object.keys(updates).filter(key => updates[key] !== undefined);
    
    if (fieldsToUpdate.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No valid fields to update' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
    const values = fieldsToUpdate.map(field => updates[field]);
    values.push(email);

    await db.query(
      `UPDATE profiles SET 
        ${setClause},
        updated_at = NOW()
      WHERE email = ?`,
      values
    );

    // Return the updated profile
    const [updatedProfile] = await db.query(
      'SELECT * FROM profiles WHERE email = ?', 
      [email]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Profile updated successfully',
        profile: updatedProfile[0]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error updating profile:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to update profile' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}