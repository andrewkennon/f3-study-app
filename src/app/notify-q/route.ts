import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { qEmail, groupName, paxName } = await request.json();

    if (!qEmail) {
      return NextResponse.json({ error: 'Missing Q email' }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: 'F3 Bible Study <onboarding@resend.dev>',
      to: [qEmail],
      subject: `[F3 Study] ${paxName} requested to join ${groupName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px;">
          <h2 style="color: #000; font-weight: 900;">New Join Request</h2>
          <p style="font-size: 14px; color: #333;">
            <strong>${paxName}</strong> has requested to join your F3 study group: <strong>${groupName}</strong>.
          </p>
          <p style="font-size: 14px; color: #333;">
            Log in to your F3 Bible Study dashboard to review and approve their request.
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 10px; color: #888; text-transform: uppercase; font-weight: bold;">
            F3 Nation Peer Study PWA
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Resend email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}