const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Create a new Vendor or Hospital


router.post('/signup', AuthController.signupUser);

// Login a Vendor or Hospital
router.post('/login', AuthController.loginUser);


module.exports = router;