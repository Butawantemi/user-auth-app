const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../Config/dbConnect');

const Organisation = sequelize.define('Organisation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orgId: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  }
});

module.exports = Organisation;
