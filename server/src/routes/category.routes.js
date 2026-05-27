import express from "express";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public - anyone can read categories
router.get("/", getAllCategories);

// Admin only
router.post("/", authMiddleware, roleMiddleware("admin"), upload.single("image"), createCategory);
router.put("/:id", authMiddleware, roleMiddleware("admin"), upload.single("image"), updateCategory);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteCategory);

export default router;
