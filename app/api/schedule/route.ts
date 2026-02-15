
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { format, parseISO, addMinutes } from 'date-fns';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'yohannayanajith40@gmail.com';

export async function POST(req: Request) {
  try {
    const { name, email, date, time, topic } = await req.json();

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Name, email, date, and time are required.' },
        { status: 400 }
      );
    }

    // Combine date and time
    // date comes as ISO string (e.g., 2023-10-25T00:00:00.000Z)
    // time comes as "HH:mm" (24h format)
    const [hours, minutes] = time.split(':').map(Number);
    const meetingStart = new Date(date);
    meetingStart.setHours(hours, minutes, 0, 0);

    const meetingEnd = addMinutes(meetingStart, 30); // 30 min meeting

    // Format dates for ICS (UTC format usually preferred: YYYYMMDDTHHHmmSSZ)
    // Using simplistic formatting for now to ensure it works
    const formatDateICS = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Veloce Technology//Website//EN
METHOD:REQUEST
BEGIN:VEVENT
UID:${Date.now()}@veloce-technology.com
DTSTAMP:${formatDateICS(new Date())}
DTSTART:${formatDateICS(meetingStart)}
DTEND:${formatDateICS(meetingEnd)}
SUMMARY:Meeting with ${name}: ${topic || 'Consultation'}
DESCRIPTION:Name: ${name}\\nEmail: ${email}\\nTopic: ${topic || 'General Inquiry'}
ORGANIZER;CN="Veloce Admin":mailto:${process.env.GMAIL_USER}
ATTENDEE;RSVP=TRUE;CN="${name}";PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT:mailto:${email}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`.trim();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: [CONTACT_EMAIL], // Admin receives the request
      cc: [email], // User receives a copy with invite
      subject: `New Meeting Request: ${name}`,
      text: `You have a new meeting request from ${name} (${email}) for ${format(meetingStart, 'PPpp')}. Topic: ${topic || 'N/A'}`,
      html: `
        <h3>New Meeting Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${format(meetingStart, 'PPpp')}</p>
        <p><strong>Topic:</strong> ${topic || 'N/A'}</p>
      `,
      icalEvent: {
        filename: 'meeting.ics',
        method: 'REQUEST',
        content: icsContent,
      },
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Meeting scheduled successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error scheduling meeting:', error);
    return NextResponse.json(
      { error: 'Failed to schedule meeting.' },
      { status: 500 }
    );
  }
}
