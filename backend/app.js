import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => {
//         console.log("Connected to MongoDB");
//     })
//     .catch((error) => {
//         console.error("Error connecting to MongoDB:", error);
//     });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

