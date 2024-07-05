const jwt = require("jsonwebtoken");
const { User } = require('../Models/user.model');
require("dotenv").config();

// Middleware to authenticate token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If token is null, send 401 status
  if (!token) return res.status(401).send({ message: "Access Denied" });

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.userId);
    if (!req.user) return res.status(401).send({ message: "Invalid Token" });
    next();
  } catch (err) {
    res.status(403).send({ message: "Invalid Token" });
  }
};

module.exports = { authenticateToken };
