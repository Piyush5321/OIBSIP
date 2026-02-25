require('dotenv').config({ path: __dirname + '/.env' })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Pizza = require('./models/Pizza')
const InventoryItem = require('./models/InventoryItem')

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  const salt = await bcrypt.genSalt(10)
  const adminHash = await bcrypt.hash('admin123', salt)
  await User.findOneAndUpdate(
    { email: 'admin@pizza.com' },
    {
      name: 'Admin',
      email: 'admin@pizza.com',
      passwordHash: adminHash,
      role: 'admin',
      isEmailVerified: true,
    },
    { upsert: true, returnDocument: 'after' }
  )
  console.log('Admin user ready: admin@pizza.com / admin123')

  await Pizza.findOneAndUpdate(
    { name: 'Custom' },
    {
      name: 'Custom',
      description: 'Build your own pizza',
      baseOptions: [
        { name: 'Thin Crust', price: 0 },
        { name: 'Regular', price: 20 },
        { name: 'Thick', price: 30 },
        { name: 'Whole Wheat', price: 25 },
        { name: 'Cheese Burst', price: 50 },
      ],
      sauceOptions: [
        { name: 'Tomato', price: 0 },
        { name: 'Pesto', price: 30 },
        { name: 'BBQ', price: 25 },
        { name: 'White Sauce', price: 35 },
        { name: 'Marinara', price: 20 },
      ],
      cheeseOptions: [
        { name: 'Mozzarella', price: 40 },
        { name: 'Cheddar', price: 35 },
        { name: 'Parmesan', price: 50 },
        { name: 'Mixed', price: 45 },
      ],
      veggieOptions: [
        { name: 'Onion', price: 15 },
        { name: 'Bell Pepper', price: 20 },
        { name: 'Olives', price: 25 },
        { name: 'Mushroom', price: 25 },
        { name: 'Tomato', price: 10 },
        { name: 'Jalapeño', price: 15 },
        { name: 'Corn', price: 20 },
        { name: 'Spinach', price: 20 },
      ],
      isActive: true,
    },
    { upsert: true, returnDocument: 'after' }
  )
  console.log('Pizza options seeded')

  const preMadePizzas = [
    {
      name: 'Margherita',
      description: 'Classic tomato sauce, mozzarella, and fresh basil.',
      fixedBase: 'Thin Crust',
      fixedSauce: 'Tomato',
      fixedCheese: 'Mozzarella',
      fixedVeggies: [],
      basePrice: 299,
      isActive: true,
    },
    {
      name: 'Veggie Supreme',
      description: 'Loaded with onion, bell pepper, olives, and mushroom.',
      fixedBase: 'Regular',
      fixedSauce: 'Tomato',
      fixedCheese: 'Mozzarella',
      fixedVeggies: ['Onion', 'Bell Pepper', 'Olives', 'Mushroom'],
      basePrice: 349,
      isActive: true,
    },
    {
      name: 'Cheese Feast',
      description: 'Triple cheese with marinara on regular crust.',
      fixedBase: 'Regular',
      fixedSauce: 'Marinara',
      fixedCheese: 'Mixed',
      fixedVeggies: [],
      basePrice: 329,
      isActive: true,
    },
    {
      name: 'Spicy Veggie',
      description: 'Onion, jalapeño, and bell pepper with cheddar.',
      fixedBase: 'Thin Crust',
      fixedSauce: 'Tomato',
      fixedCheese: 'Cheddar',
      fixedVeggies: ['Onion', 'Jalapeño', 'Bell Pepper'],
      basePrice: 339,
      isActive: true,
    },
    {
      name: 'Garden Fresh',
      description: 'Tomato, spinach, corn, and olives on whole wheat.',
      fixedBase: 'Whole Wheat',
      fixedSauce: 'Pesto',
      fixedCheese: 'Mozzarella',
      fixedVeggies: ['Tomato', 'Spinach', 'Corn', 'Olives'],
      basePrice: 369,
      isActive: true,
    },
  ]
  for (const p of preMadePizzas) {
    await Pizza.findOneAndUpdate(
      { name: p.name },
      p,
      { upsert: true, returnDocument: 'after' }
    )
  }
  console.log('Pre-made pizza varieties seeded')

  const invItems = [
    { itemType: 'base', name: 'Thin Crust', quantity: 50, threshold: 20 },
    { itemType: 'base', name: 'Regular', quantity: 50, threshold: 20 },
    { itemType: 'base', name: 'Whole Wheat', quantity: 50, threshold: 20 },
    { itemType: 'sauce', name: 'Tomato', quantity: 40, threshold: 15 },
    { itemType: 'sauce', name: 'Marinara', quantity: 40, threshold: 15 },
    { itemType: 'sauce', name: 'Pesto', quantity: 40, threshold: 15 },
    { itemType: 'cheese', name: 'Mozzarella', quantity: 30, threshold: 10 },
    { itemType: 'cheese', name: 'Cheddar', quantity: 30, threshold: 10 },
    { itemType: 'cheese', name: 'Mixed', quantity: 30, threshold: 10 },
    { itemType: 'veggie', name: 'Onion', quantity: 25, threshold: 10 },
    { itemType: 'veggie', name: 'Bell Pepper', quantity: 25, threshold: 10 },
    { itemType: 'veggie', name: 'Olives', quantity: 25, threshold: 10 },
    { itemType: 'veggie', name: 'Mushroom', quantity: 25, threshold: 10 },
    { itemType: 'veggie', name: 'Jalapeño', quantity: 25, threshold: 10 },
    { itemType: 'veggie', name: 'Tomato', quantity: 25, threshold: 10 },
    { itemType: 'veggie', name: 'Spinach', quantity: 25, threshold: 10 },
    { itemType: 'veggie', name: 'Corn', quantity: 25, threshold: 10 },
  ]
  for (const item of invItems) {
    await InventoryItem.findOneAndUpdate(
      { itemType: item.itemType, name: item.name },
      item,
      { upsert: true }
    )
  }
  console.log('Inventory items seeded')

  await mongoose.disconnect()
  console.log('Seed done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
