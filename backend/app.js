import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";


dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


// middleware routes-
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

