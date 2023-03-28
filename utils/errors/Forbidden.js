const BaseError = require('./BaseError');

class Forbidden extends BaseError {
  constructor(message) {
    super(403, message);
  }
}

module.exports = Forbidden;
