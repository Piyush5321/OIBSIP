const express = require("express");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/", authMiddleware, requireRole("admin"), getAllOrders);
router.patch("/:id/status", authMiddleware, requireRole("admin"), updateOrderStatus);

module.exports = router;

