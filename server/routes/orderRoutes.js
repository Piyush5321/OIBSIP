const express = require("express");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderHistory,
  getAllOrderHistory,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/history/my", authMiddleware, getOrderHistory);
router.get("/history", authMiddleware, requireRole("admin"), getAllOrderHistory);
router.get("/my", authMiddleware, getMyOrders);
router.get("/", authMiddleware, requireRole("admin"), getAllOrders);
router.patch("/:id/status", authMiddleware, requireRole("admin"), updateOrderStatus);

module.exports = router;

