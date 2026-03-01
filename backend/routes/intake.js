import express from 'express';
import nodemailer from 'nodemailer';
import verifyToken from '../middlewares/auth.js';
import IntakeRequest from '../models/intakeRequest.js';
import DoctorPatient from '../models/doctorPatient.js';

const router = express.Router();
const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://localhost:8000';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

function buildEmailHtml(patientName, doctorName, intakeUrl) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Health Assessment Request — Nirog AI</title>
</head>
<body style="margin:0;padding:0;background:#f0f9ff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#0ea5e9,#14b8a6);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">🩺 Nirog AI</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">AI-Powered Clinical Assessment</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 12px;color:#64748b;font-size:14px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Health Assessment Request</p>
            <h2 style="margin:0 0 20px;color:#0f172a;font-size:24px;font-weight:700;">Hello, ${patientName} 👋</h2>
            <p style="color:#475569;font-size:16px;line-height:1.7;margin:0 0 24px;">
              Your doctor, <strong style="color:#0f172a;">${doctorName}</strong>, has requested a quick health assessment using the <strong>Nirog AI</strong> platform.
            </p>
            <p style="color:#475569;font-size:16px;line-height:1.7;margin:0 0 32px;">
              Please take a few minutes to fill in your current symptoms and health information. Your responses will help generate a detailed AI report that your doctor can review before your appointment.
            </p>

            <!-- CTA BUTTON -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${intakeUrl}" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#14b8a6);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:12px;font-size:17px;font-weight:700;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(14,165,233,0.4);">
                  Fill My Health Assessment →
                </a>
              </td></tr>
            </table>

            <p style="color:#94a3b8;font-size:13px;text-align:center;margin:24px 0 0;">
              Or copy this link into your browser:<br/>
              <a href="${intakeUrl}" style="color:#0ea5e9;word-break:break-all;">${intakeUrl}</a>
            </p>

            <!-- DIVIDER -->
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;" />

            <!-- INFO BOX -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-weight:700;color:#0f172a;font-size:14px;">ℹ️ What to expect</p>
                <ul style="margin:0;padding:0 0 0 18px;color:#64748b;font-size:14px;line-height:1.8;">
                  <li>The form takes about 3–5 minutes to complete</li>
                  <li>No account or password required</li>
                  <li>Your information is used only for this assessment</li>
                  <li>This link expires in 7 days</li>
                </ul>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">
              This email was sent by <strong>Nirog AI</strong> on behalf of your healthcare provider.<br/>
              If you did not expect this email, you can safely ignore it.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// POST /api/intake/send — doctor sends intake form to patient email
router.post('/send', verifyToken, async (req, res) => {
    try {
        const { patientId } = req.body;
        if (!patientId) return res.status(400).json({ message: 'patientId is required' });

        const patient = await DoctorPatient.findOne({ _id: patientId, doctorId: req.user.id });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        if (!patient.email) return res.status(400).json({ message: 'Patient has no email address on file.' });

        // Create intake token
        const intake = await IntakeRequest.create({
            patientId: patient._id,
            doctorId: req.user.id,
        });

        const intakeUrl = `${APP_URL}/intake/${intake.token}`;
        const doctorName = req.user.name || 'Your Doctor';

        // Send email
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"Nirog AI" <${process.env.EMAIL_USER}>`,
            to: patient.email,
            subject: `${doctorName} has requested your health assessment — Nirog AI`,
            html: buildEmailHtml(patient.name, doctorName, intakeUrl),
        });

        res.json({ message: `Intake form sent to ${patient.email}`, token: intake.token });
    } catch (err) {
        console.error('Intake send error:', err);
        res.status(500).json({ message: err.message || 'Failed to send intake form' });
    }
});

// GET /api/intake/:token — public, patient fetches their form info
router.get('/:token', async (req, res) => {
    try {
        const intake = await IntakeRequest.findOne({ token: req.params.token })
            .populate('patientId', 'name age gender')
            .populate('doctorId', 'name');

        if (!intake) return res.status(404).json({ message: 'Intake link not found or expired.' });
        if (intake.status === 'completed') return res.status(410).json({ message: 'This intake form has already been submitted.' });
        if (new Date() > intake.expiresAt) return res.status(410).json({ message: 'This intake link has expired.' });

        res.json({
            patientName: intake.patientId?.name,
            patientAge: intake.patientId?.age,
            patientGender: intake.patientId?.gender,
            doctorName: intake.doctorId?.name,
            expiresAt: intake.expiresAt,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/intake/:token/submit — public, patient submits symptoms → AI → saved to doctor's record
router.post('/:token/submit', async (req, res) => {
    try {
        const intake = await IntakeRequest.findOne({ token: req.params.token })
            .populate('patientId')
            .populate('doctorId', 'name _id');

        if (!intake) return res.status(404).json({ message: 'Intake link not found.' });
        if (intake.status === 'completed') return res.status(410).json({ message: 'Already submitted.' });
        if (new Date() > intake.expiresAt) return res.status(410).json({ message: 'Link expired.' });

        const { symptoms, medications = [], followup_answers = {} } = req.body;
        if (!symptoms?.trim()) return res.status(400).json({ message: 'Symptoms are required.' });

        const patient = intake.patientId;

        // Build context-aware symptoms (same as doctor.js does)
        const contextSymptoms = `Patient: ${patient.gender}, Age ${patient.age}. ${symptoms}${patient.medicalHistory ? ` Medical history: ${patient.medicalHistory}.` : ''}${patient.allergies ? ` Allergies: ${patient.allergies}.` : ''}`;
        const allMeds = [...medications, ...(patient.currentMedications || [])];

        // Call Python AI server
        const aiResponse = await fetch(`${PYTHON_AI_URL}/assess`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms: contextSymptoms, medications: allMeds, followup_answers }),
        });

        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            return res.status(502).json({ message: 'AI service error', detail: errText });
        }

        const result = await aiResponse.json();

        // Import Assessment model
        const { default: Assessment } = await import('../models/assessment.js');

        await Assessment.create({
            userId: intake.doctorId._id,
            doctorPatientId: patient._id,
            symptoms: contextSymptoms,
            medications: allMeds,
            triage: {
                color: result.triage?.color,
                urgency_score: result.triage?.urgency_score,
                label: result.triage?.label,
                reason: result.triage?.reason,
            },
            followupAnswers: followup_answers,
            soapNote: result.soap_note,
            conditions: result.conditions,
            drugInteractions: result.drug_interactions,
            redFlags: result.red_flags,
        });

        await DoctorPatient.findByIdAndUpdate(patient._id, {
            $inc: { totalAnalyses: 1 },
            lastAnalysisAt: new Date(),
        });

        intake.status = 'completed';
        await intake.save();

        res.json({ message: 'Assessment complete! Your doctor has been notified.' });
    } catch (err) {
        console.error('Intake submit error:', err);
        res.status(500).json({ message: err.message });
    }
});

export default router;
