import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates enquiry payload and sends an email using .env SMTP settings.
 */
export async function sendEnquiryMail(payload) {
  const name = String(payload?.name ?? '').trim();
  const email = String(payload?.email ?? '').trim();
  const phone = String(payload?.phone ?? '').trim();
  const topic = String(payload?.topic ?? 'General Enquiry').trim() || 'General Enquiry';
  const message = String(payload?.message ?? '').trim();

  if (!name || name.length < 2) {
    throw new Error('Please enter your name.');
  }
  if (!EMAIL_RE.test(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!message || message.length < 5) {
    throw new Error('Please enter a brief message.');
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || user;
  const fromName = process.env.FROM_NAME || 'Gokul';

  if (!user || !pass || !fromEmail) {
    throw new Error('SMTP configuration is missing in .env.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const subject = `[Portfolio Enquiry · ${topic}] from ${name}`;
  const text = [
    `New Enquiry Received`,
    `-------------------------`,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || 'Not provided'}`,
    `Topic:   ${topic}`,
    ``,
    `Message:`,
    message,
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0c12; color: #f5f5f7; border: 1px solid #2b1218; border-radius: 12px; overflow: hidden;">
      <div style="padding: 20px 24px; background: linear-gradient(135deg, #2a0610, #12070c); border-bottom: 1px solid #3f1420;">
        <p style="margin: 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #ff3d5a; font-weight: 700;">Benita Samson · Portfolio Enquiry</p>
        <h2 style="margin: 6px 0 0; font-size: 20px; color: #ffffff;">${escapeHtml(topic)}</h2>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #a1a1aa; width: 90px;">Name</td><td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Email</td><td style="padding: 6px 0; color: #ffffff;"><a href="mailto:${escapeHtml(email)}" style="color: #ff6b81;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Phone</td><td style="padding: 6px 0; color: #ffffff;">${escapeHtml(phone || 'Not provided')}</td></tr>
        </table>
        <div style="margin-top: 18px; padding: 16px; background: #14141c; border-left: 3px solid #ff3d5a; border-radius: 6px;">
          <p style="margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #a1a1aa;">Message</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: user,
    replyTo: `"${name}" <${email}>`,
    subject,
    text,
    html,
  });
}

