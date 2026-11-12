import { sendEnquiryMail } from '../server/sendEnquiryMail.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});
    await sendEnquiryMail(payload);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err?.message || 'Failed to send enquiry' });
  }
}

