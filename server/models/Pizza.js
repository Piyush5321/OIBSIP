const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    baseOptions: [optionSchema],
    sauceOptions: [optionSchema],
    cheeseOptions: [optionSchema],
    veggieOptions: [optionSchema],
    isActive: { type: Boolean, default: true },
    // Pre-made variety: fixed recipe so ordering decrements correct inventory
    fixedBase: { type: String },
    fixedSauce: { type: String },
    fixedCheese: { type: String },
    fixedVeggies: [{ type: String }],
    basePrice: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pizza", pizzaSchema);

