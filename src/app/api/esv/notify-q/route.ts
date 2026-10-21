import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { qEmail, groupName, paxName } = await req.json();

    if (!qEmail) {
      return NextResponse.json({ error: 'Missing Q email address' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'F3 Bible Study App <onboarding@resend.dev>',
      to: [qEmail],
      subject: `[Action Required] New Join Request for ${groupName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.5;">
          <h2 style="margin-bottom: 8px;">New Join Request</h2>
          <p><strong>${paxName}</strong> has requested to join your study group: <strong>${groupName}</strong>.</p>
          <p>Click below to open your Q Approval Panel and process the request:</p>
          <a href="https://${process.env.VERCEL_URL || 'localhost:3000'}/manage-group" 
             style="background: #000; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 10px;">
             Open Q Approval Panel
          </a>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}