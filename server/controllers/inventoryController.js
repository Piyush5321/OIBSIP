const InventoryItem = require("../models/InventoryItem");

const getInventory = async (req, res, next) => {
  try {
    const items = await InventoryItem.find().sort({ itemType: 1, name: 1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await InventoryItem.findByIdAndUpdate(id, updates, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  updateInventoryItem,
};

