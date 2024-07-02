// seedAdmin.js
const { sequelize, User } = require('../models/db');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin';
  const isAdmin = true;

  try {
    await sequelize.sync();

    const [admin, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        email: adminEmail,
        password: adminPassword,
        isAdmin: isAdmin,
      },
    });

    if (created) {
      console.log(`Admin user created with email: ${adminEmail}`);
    } else {
      console.log(`Admin user already exists with email: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};
module.exports = seedAdmin;