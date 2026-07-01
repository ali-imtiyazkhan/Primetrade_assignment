require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@primetrade.com';
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      console.log('Admin user already exists');
    } else {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin user created:');
      console.log('  Email: admin@primetrade.com');
      console.log('  Password: admin123');
    }

    const userEmail = 'user@primetrade.com';
    const existingUser = await User.findOne({ email: userEmail });

    if (existingUser) {
      console.log('Test user already exists');
    } else {
      await User.create({
        name: 'Test User',
        email: userEmail,
        password: 'user123',
        role: 'user',
      });
      console.log('Test user created:');
      console.log('  Email: user@primetrade.com');
      console.log('  Password: user123');
    }

    await mongoose.connection.close();
    console.log('Done.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
