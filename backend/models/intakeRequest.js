import mongoose from 'mongoose';
import crypto from 'crypto';

const intakeRequestSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(32).toString('hex'),
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorPatient',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
}, { timestamps: true });

export default mongoose.model('IntakeRequest', intakeRequestSchema);
