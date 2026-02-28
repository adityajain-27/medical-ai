import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Optional: set when assessment is run by a doctor for their managed patient
    doctorPatientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorPatient",
        default: null,
        index: true,
    },
    symptoms: {
        : String,
    ired: true

cations: [String],
    ge: {
    r: String,
        ncy_score: Number,
            l: String,
                on: String

    owupAnswers: {
        : Object,
            ult: { }

        Note: {
            ective: String,
                ctive: String,
                    ssment: String,
        : String

            itions: [
        
            : String,
                ability: String,
                code: String
        
    
    Interactions: [

                    1: String,
                    2: String,
                    rity: String,
                    ription: String
        
    
    lags: [String]
 timestamps: true });

        export default mongoose.model("Assessment", assessmentSchema);
