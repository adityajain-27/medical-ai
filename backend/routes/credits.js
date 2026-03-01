import express from "express";
import verifyToken from "../middlewares/auth.js";
import User from "../models/user.js";

const router = express.Router();

const PACKAGES = [
    { id: "starter", credits: 300, price: 99, label: "Starter" },
    { id: "standard", credits: 750, price: 249, label: "Standard" },
    { id: "pro", credits: 1500, price: 499, label: "Pro" },
];

const REPORT_COST = 150;

router.get("/", verifyToken, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).select("credits name email");
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.credits === undefined || user.credits === null) {
            user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: { credits: 500 } },
                { new: true }
            ).select("credits name email");
        }

        res.json({ credits: user.credits, packages: PACKAGES });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/deduct", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("credits");
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.credits < REPORT_COST) {
            return res.status(402).json({
                message: "Insufficient credits",
                credits: user.credits,
                required: REPORT_COST,
            });
        }

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { credits: -REPORT_COST } },
            { new: true }
        ).select("credits");

        res.json({
            message: `${REPORT_COST} credits deducted`,
            credits: updated.credits,
            deducted: REPORT_COST,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/buy", verifyToken, async (req, res) => {
    try {
        const { packageId } = req.body;
        const pkg = PACKAGES.find(p => p.id === packageId);
        if (!pkg) return res.status(400).json({ message: "Invalid package" });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { credits: pkg.credits } },
            { new: true }
        ).select("credits");

        res.json({
            message: `Successfully added ${pkg.credits} credits`,
            credits: user.credits,
            added: pkg.credits,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
