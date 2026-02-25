const express = require("express");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { getPizzas, createOrUpdatePizza } = require("../controllers/pizzaController");

const router = express.Router();

router.get("/", getPizzas);

router.post("/", authMiddleware, requireRole("admin"), createOrUpdatePizza);
router.put("/:id", authMiddleware, requireRole("admin"), createOrUpdatePizza);

module.exports = router;

