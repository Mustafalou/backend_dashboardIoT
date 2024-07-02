// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/db'); // Assuming you have a User model in models directory
const userActivityController = require('./userActivityController');

const secretKey = 'your_secret_key';

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // Generate JWT
        const token = jwt.sign({ userId: user.id, userEmail:user.email }, secretKey, { expiresIn: '1h' });
        res.cookie('accessToken', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 });
        await userActivityController.logActivity(user.id,user.email, 'login', `User logged in`);
        res.send({ message: "Logged in successfully" });
      
    } else {
        res.status(401).send({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.logout= async (req, res) => {
    try {
        res.clearCookie('accesToken');
        res.send({ message: "Logged out successfully" });
        await userActivityController.logActivity(req.user.userId,req.user.email, 'logout', `User logged out`);
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send({ message: "Internal server error" });
    }
};
exports.getUserInfo = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      // Exclude password from the response
      const { password, ...userInfo } = user.toJSON();
      res.send(userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).send({ message: "Internal server error" });
    }
  };