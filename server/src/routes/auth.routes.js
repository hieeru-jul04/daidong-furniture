import express from "express";
import { register, login, logout, updateProfile, changePassword } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.json({ message: "Xin chào Admin!" });
});

import User from "../models/user.model.js";

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;