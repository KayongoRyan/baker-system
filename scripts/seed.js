require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Staff = require('../models/Staff');

const defaultProducts = [
  { name: 'Sambusa', price: 2.50, category: 'pastry', description: 'Delicious stuffed pastry with various fillings.' },
  { name: 'Pain-coupe', price: 3.00, category: 'bread', description: 'French-style bread with a crispy crust and soft interior.' },
  { name: 'Pizza', price: 8.00, category: 'main', description: 'Classic pizza with your favorite toppings.' },
  { name: 'Amandazi', price: 1.50, category: 'pastry', description: 'Sweet and fluffy East African doughnut.' },
  { name: 'Cakes', price: 15.00, category: 'dessert', description: 'Rich and decadent cakes for any occasion.' },
  { name: 'Boulet', price: 6.00, category: 'main', description: 'Savory meatballs for a delightful meal.' },
  { name: 'Sausages', price: 5.00, category: 'main', description: 'Juicy and flavorful sausages.' },
  { name: 'Tacos', price: 3.50, category: 'main', description: 'Tasty tacos with various fillings.' },
  { name: 'Amata', price: 10.00, category: 'beverage', description: 'Fresh milk from the farm.' },
  { name: 'Amazi', price: 4.00, category: 'beverage', description: 'Refreshing and pure water.' },
  { name: 'Umugati', price: 2.00, category: 'snack', description: 'Traditional Rwandan snack.' },
  { name: 'Birthday Cake', price: 20.00, category: 'dessert', description: 'A special cake to celebrate birthdays in style.' },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bakery';
    await mongoose.connect(uri);
    let productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(defaultProducts);
      console.log('Seeded', defaultProducts.length, 'products');
    } else {
      console.log('Products already exist, skipping product seed');
    }
    const staffCount = await Staff.countDocuments();
    if (staffCount === 0) {
      const managerUser = await User.create({ username: 'manager', email: 'manager@bakery.com', passwordHash: 'demo', role: 'manager' });
      await Staff.create({ userId: managerUser._id, role: 'manager', pin: '1234' });
      const cashierUser = await User.create({ username: 'cashier', email: 'cashier@bakery.com', passwordHash: 'demo', role: 'staff' });
      await Staff.create({ userId: cashierUser._id, role: 'cashier', pin: '5678' });
      console.log('Seeded default staff (manager:1234, cashier:5678)');
    }
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
