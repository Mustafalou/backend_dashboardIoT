// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);
router.get('/', userController.getUsers);
router.delete('/:id', userController.deleteUser);

module.exports = router;