// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

router.post('/create', authenticateToken, userController.createUser);
router.get('/',authenticateToken, userController.getUsers);
router.delete('/:id',authenticateToken, userController.deleteUser);
router.get('/logs', authenticateToken, userController.getUserActivityLogs); 
module.exports = router;