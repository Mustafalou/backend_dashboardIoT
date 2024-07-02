// controllers/userActivityController.js
const { UserActivityLog } = require('../models/db');

exports.logActivity = async (userId, userEmail,action, details) => {
  try {
    await UserActivityLog.create({ userId, userEmail, action, details });
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};
