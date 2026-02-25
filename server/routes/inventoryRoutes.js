const express = require("express");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { getInventory, updateInventoryItem } = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", authMiddleware, requireRole("admin"), getInventory);
router.patch("/:id", authMiddleware, requireRole("admin"), updateInventoryItem);

module.exports = router;

