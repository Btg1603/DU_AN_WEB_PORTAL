// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// PUBLIC ROUTES
router.post('/register', userController.register);
router.post('/login', userController.login);

// PRIVATE ROUTE (Đã bỏ check token để test)
router.get('/profile', userController.getProfile); 

module.exports = router;