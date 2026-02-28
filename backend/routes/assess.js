import express from "express";
import verifyToken from "../middlewares/auth.js";
import Assessment from "../models/assessment.js";
import User from "../models/user.js";

const router = express.Router();

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || "http://localhost:8000";
const CREDITS_PER_REPORT = 150;

router.post("/", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.credits < CREDITS_PER_REPORT) {
            return res.status(402).json({
                message: "Insufficient credits",
                credits: user.credits,
                required: CREDITS_PER_REPORT
            });
        }

        const { symptoms, medications = [], followup_answers = {} } = req.body;

        const aiResponse = await fetch(`${PYTHON_AI_URL}/assess`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms, medications, followup_answers })
        });

        if (!aiResponse.ok) {
            return res.status(502).json({ message: "AI service error" });
        }

        const result = await aiResponse.json();

        const [saved] = await Promise.all([
            Assessment.create({
                userId: req.user.id,
                symptoms,
                medications,
                triage: {
                    color: result.triage?.color,
                    urgency_score: result.triage?.urgency_score,
                    label: result.triage?.label,
                    reason: result.triage?.reason
                },
                followupAnswers: followup_answers,
                soapNote: result.soap_note,
                conditions: result.conditions,
                drugInteractions: result.drug_interactions,
                redFlags: result.red_flags
            }),
            User.findByIdAndUpdate(req.user.id, { $inc: { credits: -CREDITS_PER_REPORT } })
        ]);

        const newCredits = user.credits - CREDITS_PER_REPORT;
        res.status(200).json({ ...result, assessmentId: saved._id, creditsRemaining: newCredits });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/history", verifyToken, async (req, res) => {
    try {
        const assessments = await Assessment.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .select("symptoms triage createdAt");

        res.status(200).json(assessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", verifyToken, async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);

        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        if (assessment.userId.toString() !== req.user.id && req.user.role !== "doctor") {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(assessment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/followup", verifyToken, async (req, res) => {
    try {
        const { symptoms, medications = [] } = req.body;

        const aiResponse = await fetch(`${PYTHON_AI_URL}/followup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms, medications })
        });

        if (!aiResponse.ok) {
            return res.status(502).json({ message: "AI followup service error" });
        }

        const result = await aiResponse.json();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/chat", verifyToken, async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        const aiResponse = await fetch(`${PYTHON_AI_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, history })
        });

        if (!aiResponse.ok) {
            return res.status(502).json({ message: "AI chat service error" });
        }

        const result = await aiResponse.json();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
