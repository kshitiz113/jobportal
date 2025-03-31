import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import db from '@/lib/db';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// Disable Next.js body parsing to allow formidable to handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const cookies = parse(req.headers.get('cookie') || '');
  const email = cookies.user_email;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Convert Next.js Request to Readable Stream
  const stream = new Readable();
  stream.push(Buffer.from(await req.arrayBuffer())); // Convert arrayBuffer to Buffer
  stream.push(null); // Signal end of stream

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    multiples: false,
  });

  return new Promise((resolve, reject) => {
    form.parse(stream, async (err, fields, files) => {
      if (err) {
        return reject(NextResponse.json({ error: 'Error parsing form data' }, { status: 500 }));
      }

      const { full_name, skills, course, college, tenth_percent, twelfth_percent, github_id } = fields;
      let photoPath = '/uploads/default-avatar.png';

      if (files.photo) {
        const file = files.photo[0];
        const newFilePath = path.join(form.uploadDir, file.newFilename);
        fs.renameSync(file.filepath, newFilePath);
        photoPath = `/uploads/${file.newFilename}`;
      }

      const existingProfile = await db.query('SELECT * FROM profiles WHERE email = ?', [email]);

      if (existingProfile.length) {
        await db.query(
          `UPDATE profiles SET full_name=?, skills=?, course=?, college=?, tenth_percent=?, twelfth_percent=?, github_id=?, photo=? WHERE email=?`,
          [full_name, skills, course, college, tenth_percent, twelfth_percent, github_id, photoPath, email]
        );
      } else {
        await db.query(
          `INSERT INTO profiles (full_name, email, skills, course, college, tenth_percent, twelfth_percent, github_id, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [full_name, email, skills, course, college, tenth_percent, twelfth_percent, github_id, photoPath]
        );
      }

      resolve(NextResponse.json({ success: true, photo: photoPath }));
    });
  });
}
