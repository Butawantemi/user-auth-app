const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../Controllers/auth.controller');

const router = express.Router();

// Route for register a new user
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], register);

// Routes for login a user
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

module.exports = router;
