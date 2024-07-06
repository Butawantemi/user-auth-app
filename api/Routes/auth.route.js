const express = require('express');
const { body } = require('express-validator');
const { register, login, getUser } = require('../Controllers/auth.controller');

const router = express.Router();

// Route for register a new user
router.post('/auth/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], register);

// Routes for login a user
router.post('/auth/login', [
  body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

router.get('/api/users/:id', getUser);

module.exports = router;
