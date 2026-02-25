require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Global middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("PizzaWizza API Running 🍕");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);

// Error handler
app.use(errorHandler);

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});