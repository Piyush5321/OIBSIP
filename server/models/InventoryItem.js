const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["base", "sauce", "cheese", "veggie", "meat"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    threshold: {
      type: Number,
      required: true,
      default: 0,
    },
    lastLowStockAlertAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);

