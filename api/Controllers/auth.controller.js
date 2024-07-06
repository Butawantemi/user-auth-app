const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  User  = require('../Models/user.model');
const Organisation = require('../Models/organisation.model')
const { validationResult } = require('express-validator');


// Register a new user
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const orgName = `${firstName}'s Organisation`;
    const organisation = await Organisation.create({ name: orgName });

    await user.addOrganisation(organisation);

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
};


// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};

// Get user details
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user details along with organizations they belong to or created
    const user = await User.findOne({
      where: { userId },
      include: [
        {
          model: Organisation,
          through: { attributes: [] } // Exclude the join table attributes
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        statusCode: 404
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User details fetched successfully',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user details',
      statusCode: 500
    });
  }
};

module.exports = { register, login, getUser }
