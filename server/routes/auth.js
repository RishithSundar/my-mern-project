const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// POST route for user registration (http://localhost:8000/api/auth/register)
router.post('/register', registerUser);

// POST route for user login (http://localhost:8000/api/auth/login)
router.post('/login', loginUser);

module.exports = router;