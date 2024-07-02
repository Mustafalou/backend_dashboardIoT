
const { User, UserActivityLog } = require('../models/db'); // Adjust the path to import from models/db
const userActivityController = require('./userActivityController');
exports.createUser = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;
    const newUser = await User.create({ email, password: password, isAdmin });
    await userActivityController.logActivity(req.user.id,req.user.email, 'create', `User created with email ${email}`);
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
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Check if the user is an admin
    if (user.isAdmin) {
    const adminCount = await User.count({ where: { isAdmin: true } });

    // Prevent deletion if this is the last admin
    if (adminCount <= 1) {
        return res.status(400).send({ message: 'Cannot delete the last admin user' });
    }
    }
    await userActivityController.logActivity(req.user.id,req.user.email, 'delete', `User deleted with email ${user.email}`);
    await user.destroy();
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
exports.getUserActivityLogs = async (req, res) => {
    try {
      const logs = await UserActivityLog.findAll();
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching user activity logs:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };