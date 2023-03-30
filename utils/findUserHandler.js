const NotFound = require('./errors/NotFound');
const STATUS = require('./constants/status');
const User = require('../models/user');

// eslint-disable-next-line
module.exports = async (id) => {
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFound(STATUS.USER_NOT_FOUND);
      }
      return user;
    })
    .catch();
};
