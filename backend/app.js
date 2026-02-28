import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import assessRoutes from "./routes/assess.js";
import doctorRoutes from "./routes/doctor.js";
import creditsRoutes from "./routes/credits.js";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/assess", assessRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/credits", creditsRoutes);


app.get("/", (req, res) => {
    res.send("MediTriage AI Backend — v2.0");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
