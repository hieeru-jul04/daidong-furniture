import express from "express";
import { 
    createOrder, 
    getAllOrders, 
    updateOrderStatus, 
    getMyOrders,
    cancelOrder,
    deleteOrder
} from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

// Public route to create order (or can be protected depending on needs)
router.post("/", createOrder);

// Protected routes for users
router.get("/myorders", authMiddleware, getMyOrders);
router.put("/:id/cancel", authMiddleware, cancelOrder);

// Protected routes for Admin
router.get("/", authMiddleware, roleMiddleware("admin"), getAllOrders);
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), updateOrderStatus);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteOrder);

export default router;
