const BaseError = require('./BaseError');

class Unauthorized extends BaseError {
  constructor(message) {
    super(401, message);
  }
}

module.exports = Unauthorized;
