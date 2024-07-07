const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // This will help enforce SSL connection
      rejectUnauthorized: false // If you are facing issues with self-signed certificates
    }
  }
});

module.exports = sequelize;

