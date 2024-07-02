// controllers/userActivityController.js
const { UserActivityLog } = require('../models/db');

exports.logActivity = async (userId, action, details) => {
  try {
    await UserActivityLog.create({ userId, action, details });
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};
