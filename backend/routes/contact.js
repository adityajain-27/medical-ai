import express from 'express';
import { Resend } from 'resend';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;
        if (!firstName || !email || !message) {
            return res.status(400).json({ message: 'Name, email and message are required.' });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'Nirog AI <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || 'niroghealthai@gmail.com'],
            replyTo: email,
            subject: `[Nirog AI Contact] ${subject || 'New message from ' + firstName}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0f9ff;padding:24px;border-radius:12px;">
                    <h2 style="color:#0ea5e9;margin-bottom:4px;">New Contact Form Submission</h2>
                    <p style="color:#64748b;font-size:14px;margin-bottom:24px;">Someone reached out via the Nirog AI contact page.</p>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr><td style="padding:10px 0;color:#64748b;font-size:14px;width:120px;"><strong>Name</strong></td><td style="padding:10px 0;font-size:14px;">${firstName} ${lastName || ''}</td></tr>
                        <tr><td style="padding:10px 0;color:#64748b;font-size:14px;"><strong>Email</strong></td><td style="padding:10px 0;font-size:14px;"><a href="mailto:${email}" style="color:#0ea5e9;">${email}</a></td></tr>
                        <tr><td style="padding:10px 0;color:#64748b;font-size:14px;"><strong>Subject</strong></td><td style="padding:10px 0;font-size:14px;">${subject || '—'}</td></tr>
                    </table>
                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
                    <p style="color:#64748b;font-size:14px;margin-bottom:8px;"><strong>Message</strong></p>
                    <p style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#1e293b;">${message.replace(/\n/g, '<br/>')}</p>
                    <p style="color:#94a3b8;font-size:12px;margin-top:20px;">Reply directly to this email to respond to ${firstName}.</p>
                </div>
            `,
        });

        res.status(200).json({ message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again.' });
    }
});

export default router;
