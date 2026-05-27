import express from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public - anyone can view products
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin only
router.post("/", authMiddleware, roleMiddleware("admin"), upload.array("images", 5), createProduct);
router.put("/:id", authMiddleware, roleMiddleware("admin"), upload.array("images", 5), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProduct);

export default router;
