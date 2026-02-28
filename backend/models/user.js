import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["patient", "doctor"], default: "patient" },
    credits: { type: Number, default: 500 },
    googleId: { type: String },
    position: { type: String, default: "" },
    qualification: { type: String, default: "" },
}, { timestamps: true });


export default mongoose.model("User", userSchema);
