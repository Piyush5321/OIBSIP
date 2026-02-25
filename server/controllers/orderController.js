const Order = require("../models/Order");
const InventoryItem = require("../models/InventoryItem");

// Build map of required inventory: key "itemType|name" -> total quantity needed
function getRequiredStock(items) {
  const required = {};
  for (const item of items) {
    const qty = item.quantity || 1;
    const baseKey = `base|${item.base}`;
    const sauceKey = `sauce|${item.sauce}`;
    const cheeseKey = `cheese|${item.cheese}`;
    required[baseKey] = (required[baseKey] || 0) + qty;
    required[sauceKey] = (required[sauceKey] || 0) + qty;
    required[cheeseKey] = (required[cheeseKey] || 0) + qty;
    for (const v of item.veggies || []) {
      const key = `veggie|${v}`;
      required[key] = (required[key] || 0) + qty;
    }
  }
  return required;
}

const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const required = getRequiredStock(items);

    // Validate stock before creating order
    for (const [key, needed] of Object.entries(required)) {
      const [itemType, name] = key.split("|");
      const inv = await InventoryItem.findOne({ itemType, name });
      if (!inv) continue; // no inventory record = skip check (e.g. optional topping)
      if (inv.quantity < needed) {
        return res.status(400).json({
          message: `Insufficient stock for "${name}" (${itemType}). Available: ${inv.quantity}, needed: ${needed}.`,
        });
      }
    }

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
    });

    // Decrement inventory after order is placed
    for (const [key, qty] of Object.entries(required)) {
      const [itemType, name] = key.split("|");
      await InventoryItem.findOneAndUpdate(
        { itemType, name, quantity: { $gte: qty } },
        { $inc: { quantity: -qty } }
      );
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};

