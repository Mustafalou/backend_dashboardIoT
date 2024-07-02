
const { User } = require('../models/db'); // Adjust the path to import from models/db

exports.createUser = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;
    const newUser = await User.create({ email, password: password, isAdmin });
    res.status(201).send({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userInfo } = user.toJSON();
      return userInfo;
    });
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.status(200).send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
