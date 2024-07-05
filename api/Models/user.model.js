const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../Config/dbConnect');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  }
});

const Organisation = require('./organisation.model');

User.belongsToMany(Organisation, { through: 'UserOrganisation' });
Organisation.belongsToMany(User, { through: 'UserOrganisation' });

module.exports = User;
