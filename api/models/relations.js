const User = require('./user');
const Organisation = require('./organisation');

User.belongsToMany(Organisation, { through: 'UserOrganisation' });
Organisation.belongsToMany(User, { through: 'UserOrganisation' });

module.exports = {
  User,
  Organisation,
};