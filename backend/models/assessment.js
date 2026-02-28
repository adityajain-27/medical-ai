import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctorPatientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorPatient",
        default: null,
        index: true,
    },
    symptoms: {
        type: String,
        required: true
    },
    medications: [String],
    triage: {
        color: String,
        urgency_score: Number,
        label: String,
        reason: String
    },
    followupAnswers: {
        type: Object,
        default: {}
    },
    soapNote: {
        subjective: String,
        objective: String,
        assessment: String,
        plan: String
    },
    conditions: [
        {
            name: String,
            probability: String,
            icd_code: String
        }
    ],
    drugInteractions: [
        {
            drug1: String,
            drug2: String,
            severity: String,
            description: String
        }
    ],
    redFlags: [String]
}, { timestamps: true });

export default mongoose.model("Assessment", assessmentSchema);
