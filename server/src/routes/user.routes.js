import express from "express";
import { getUsers, deleteUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

// Admin routes for managing users
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

export default router;
