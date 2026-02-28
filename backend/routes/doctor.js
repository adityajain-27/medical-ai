import express from "express";
import verifyToken from "../middlewares/auth.js";
import requireRole from "../middlewares/role.js";
import Assessment from "../models/assessment.js";
import DoctorPatient from "../models/doctorPatient.js";

const router = express.Router();
const PYTHON_AI_URL = process.env.PYTHON_AI_URL || "http://localhost:8000";

router.use(verifyToken, requireRole("doctor"));

router.get("/patients", async (req, res) => {
    try {
        const patients = await DoctorPatient.find({ doctorId: req.user.id })
            .sort({ createdAt: -1 });

        const result = await Promise.all(patients.map(async (p) => {
            const latest = await Assessment.findOne({ doctorPatientId: p._id })
                .sort({ createdAt: -1 })
                .select("triage createdAt symptoms");

            return {
                ...p.toObject(),
                latestTriage: latest?.triage || null,
                lastVisit: latest?.createdAt || null,
                lastSymptoms: latest?.symptoms || null,
            };
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/patients", async (req, res) => {
    try {
        const { name, age, gender, email, phone, medicalHistory, currentMedications, allergies, bloodGroup } = req.body;

        if (!name || !age || !gender) {
            return res.status(400).json({ message: "Name, age and gender are required" });
        }

        const patient = await DoctorPatient.create({
            doctorId: req.user.id,
            name, age, gender, email, phone,
            medicalHistory, currentMedications, allergies, bloodGroup,
        });

        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/patients/:id", async (req, res) => {
    try {
        const patient = await DoctorPatient.findOne({ _id: req.params.id, doctorId: req.user.id });
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const assessments = await Assessment.find({ doctorPatientId: patient._id })
            .sort({ createdAt: -1 });

        res.json({ patient, assessments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/patients/:id", async (req, res) => {
    try {
        const patient = await DoctorPatient.findOneAndUpdate(
            { _id: req.params.id, doctorId: req.user.id },
            { $set: req.body },
            { new: true }
        );
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/patients/:id", async (req, res) => {
    try {
        const patient = await DoctorPatient.findOneAndDelete({ _id: req.params.id, doctorId: req.user.id });
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json({ message: "Patient removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/patients/:id/analyze", async (req, res) => {
    try {
        const patient = await DoctorPatient.findOne({ _id: req.params.id, doctorId: req.user.id });
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const { symptoms, medications = [], severity } = req.body;
        if (!symptoms) return res.status(400).json({ message: "Symptoms are required" });

        const contextSymptoms = `Patient: ${patient.gender}, Age ${patient.age}. ${symptoms}${severity ? ` Symptom severity: ${severity}/10.` : ""
            }${patient.medicalHistory ? ` Medical history: ${patient.medicalHistory}.` : ""
            }${patient.allergies ? ` Allergies: ${patient.allergies}.` : ""}`;

        const meds = [...medications, ...(patient.currentMedications || [])];

        const aiResponse = await fetch(`${PYTHON_AI_URL}/assess`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms: contextSymptoms, medications: meds, followup_answers: {} })
        });

        if (!aiResponse.ok) return res.status(502).json({ message: "AI service error" });
        const result = await aiResponse.json();

        const saved = await Assessment.create({
            userId: req.user.id,
            doctorPatientId: patient._id,
            symptoms: contextSymptoms,
            medications: meds,
            triage: {
                color: result.triage?.color,
                urgency_score: result.triage?.urgency_score,
                label: result.triage?.label,
                reason: result.triage?.reason
            },
            soapNote: result.soap_note,
            conditions: result.conditions,
            drugInteractions: result.drug_interactions,
            redFlags: result.red_flags
        });

        await DoctorPatient.findByIdAndUpdate(patient._id, {
            $inc: { totalAnalyses: 1 },
            lastAnalysisAt: new Date()
        });

        res.json({ ...result, assessmentId: saved._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/patients/:id/analyze/image", async (req, res) => {
    try {
        const patient = await DoctorPatient.findOne({ _id: req.params.id, doctorId: req.user.id });
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const { symptoms, medications = [], severity, imageBase64, imageType = "image/jpeg" } = req.body;
        if (!symptoms) return res.status(400).json({ message: "Symptoms are required" });
        if (!imageBase64) return res.status(400).json({ message: "Image is required" });

        const contextSymptoms = `Patient: ${patient.gender}, Age ${patient.age}. ${symptoms}${severity ? ` Symptom severity: ${severity}/10.` : ""
            }${patient.medicalHistory ? ` Medical history: ${patient.medicalHistory}.` : ""
            }${patient.allergies ? ` Allergies: ${patient.allergies}.` : ""}`;

        const meds = [...medications, ...(patient.currentMedications || [])];

        const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const { default: FormData } = await import("form-data");
        const form = new FormData();
        form.append("symptoms", contextSymptoms);
        form.append("medications", JSON.stringify(meds));
        form.append("image", imageBuffer, { filename: "symptom.jpg", contentType: imageType });

        const aiResponse = await fetch(`${PYTHON_AI_URL}/assess/image`, {
            method: "POST",
            headers: form.getHeaders(),
            body: form
        });

        if (!aiResponse.ok) return res.status(502).json({ message: "AI vision service error" });
        const result = await aiResponse.json();

        const saved = await Assessment.create({
            userId: req.user.id,
            doctorPatientId: patient._id,
            symptoms: contextSymptoms,
            medications: meds,
            triage: {
                color: result.triage?.color,
                urgency_score: result.triage?.urgency_score,
                label: result.triage?.label,
                reason: result.triage?.reason
            },
            soapNote: result.soap_note,
            conditions: result.conditions,
            drugInteractions: result.drug_interactions,
            redFlags: result.red_flags
        });

        await DoctorPatient.findByIdAndUpdate(patient._id, {
            $inc: { totalAnalyses: 1 },
            lastAnalysisAt: new Date()
        });

        res.json({ ...result, assessmentId: saved._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/assessments", async (req, res) => {
    try {
        const patientIds = await DoctorPatient.find({ doctorId: req.user.id }).distinct("_id");
        const assessments = await Assessment.find({ doctorPatientId: { $in: patientIds } })
            .sort({ createdAt: -1 })
            .populate("doctorPatientId", "name age gender patientId");
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/stats", async (req, res) => {
    try {
        const totalPatients = await DoctorPatient.countDocuments({ doctorId: req.user.id });
        const patientIds = await DoctorPatient.find({ doctorId: req.user.id }).distinct("_id");
        const totalAssessments = await Assessment.countDocuments({ doctorPatientId: { $in: patientIds } });

        const triageCounts = await Assessment.aggregate([
            { $match: { doctorPatientId: { $in: patientIds } } },
            { $group: { _id: "$triage.color", count: { $sum: 1 } } }
        ]);

        const avgUrgency = await Assessment.aggregate([
            { $match: { doctorPatientId: { $in: patientIds }, "triage.urgency_score": { $exists: true, $ne: null } } },
            { $group: { _id: null, avg: { $avg: "$triage.urgency_score" } } }
        ]);

        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentAssessments = await Assessment.countDocuments({
            doctorPatientId: { $in: patientIds },
            createdAt: { $gte: weekAgo }
        });

        const topConditions = await Assessment.aggregate([
            { $match: { doctorPatientId: { $in: patientIds } } },
            { $unwind: "$conditions" },
            { $group: { _id: "$conditions.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const triageMap = {};
        triageCounts.forEach(t => { triageMap[t._id || "UNKNOWN"] = t.count; });

        res.json({
            totalPatients,
            totalAssessments,
            recentAssessments,
            avgUrgencyScore: avgUrgency[0]?.avg ? Math.round(avgUrgency[0].avg * 10) / 10 : null,
            triageBreakdown: { RED: triageMap.RED || 0, YELLOW: triageMap.YELLOW || 0, GREEN: triageMap.GREEN || 0 },
            topConditions: topConditions.map(c => ({ name: c._id, count: c.count }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
