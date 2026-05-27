import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

// Get dashboard statistics
router.get("/", authMiddleware, roleMiddleware("admin"), getDashboardStats);

export default router;
