import mongoose from "mongoose";

function generatePatientId() {
    const prefix = "PT";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

const doctorPatientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        unique: true,
        default: generatePatientId,
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 150 },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },

    medicalHistory: { type: String, default: "" },
    currentMedications: [{ type: String }],
    allergies: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },

    status: { type: String, enum: ["active", "inactive"], default: "active" },

    lastAnalysisAt: { type: Date, default: null },
    totalAnalyses: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("DoctorPatient", doctorPatientSchema);
