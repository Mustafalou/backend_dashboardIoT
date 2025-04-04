// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, alertController.getLogsAlert);
module.exports = router;
