const jwt = require('jsonwebtoken');
const STATUS = require('../utils/constants/status');
const Unauthorized = require('../utils/errors/Unauthorized');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized(STATUS.UNAUTHORIZED_USER);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized(STATUS.UNAUTHORIZED_USER);
  }

  req.user = payload;

  next();
};
