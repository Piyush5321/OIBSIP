const Pizza = require("../models/Pizza");

const PREMADE_PIZZAS = [
  { name: 'Margherita', description: 'Classic tomato sauce, mozzarella, and fresh basil.', fixedBase: 'Thin Crust', fixedSauce: 'Tomato', fixedCheese: 'Mozzarella', fixedVeggies: [], basePrice: 299, isActive: true },
  { name: 'Veggie Supreme', description: 'Loaded with onion, bell pepper, olives, and mushroom.', fixedBase: 'Regular', fixedSauce: 'Tomato', fixedCheese: 'Mozzarella', fixedVeggies: ['Onion', 'Bell Pepper', 'Olives', 'Mushroom'], basePrice: 349, isActive: true },
  { name: 'Cheese Feast', description: 'Triple cheese with marinara on regular crust.', fixedBase: 'Regular', fixedSauce: 'Marinara', fixedCheese: 'Mixed', fixedVeggies: [], basePrice: 329, isActive: true },
  { name: 'Spicy Veggie', description: 'Onion, jalapeño, and bell pepper with cheddar.', fixedBase: 'Thin Crust', fixedSauce: 'Tomato', fixedCheese: 'Cheddar', fixedVeggies: ['Onion', 'Jalapeño', 'Bell Pepper'], basePrice: 339, isActive: true },
  { name: 'Garden Fresh', description: 'Tomato, spinach, corn, and olives on whole wheat.', fixedBase: 'Whole Wheat', fixedSauce: 'Pesto', fixedCheese: 'Mozzarella', fixedVeggies: ['Tomato', 'Spinach', 'Corn', 'Olives'], basePrice: 369, isActive: true },
];

async function ensurePreMadePizzasExist() {
  const count = await Pizza.countDocuments({ fixedBase: { $exists: true, $ne: null } });
  if (count >= PREMADE_PIZZAS.length) return;
  for (const p of PREMADE_PIZZAS) {
    await Pizza.findOneAndUpdate(
      { name: p.name },
      p,
      { upsert: true, returnDocument: 'after' }
    );
  }
}

const getPizzas = async (req, res, next) => {
  try {
    await ensurePreMadePizzasExist();
    const pizzas = await Pizza.find({ isActive: true });
    res.json(pizzas);
  } catch (error) {
    next(error);
  }
};

const createOrUpdatePizza = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    let pizza;
    if (id) {
      pizza = await Pizza.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    } else {
      pizza = await Pizza.create(data);
    }

    res.status(id ? 200 : 201).json(pizza);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPizzas,
  createOrUpdatePizza,
};

