import express from "express";
import verifyToken from "../middlewares/auth.js";
import Assessment from "../models/assessment.js";

const router = express.Router();

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || "http://localhost:8000";

router.post("/", verifyToken, async (req, res) => {
    try {
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

        const saved = await Assessment.create({
            userId: req.user.id,
            symptoms,
            medications,
            triage: result.triage,
            soapNote: result.soap_note,
            conditions: result.conditions,
            drugInteractions: result.drug_interactions,
            redFlags: result.red_flags
        });

        res.status(200).json({ ...result, assessmentId: saved._id });
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

export default router;
