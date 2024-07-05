const jwt = require("jsonwebtoken");
const { User } = require("../Models");
require("dotenv").config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send({ message: "Invalid Token" });
      req.user = user;
      next();
    });
  } catch {
    res.status(401).send({ message: "Invalid Token" });
  }
};

module.exports = { authenticateToken };
