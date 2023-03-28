const BaseError = require('./BaseError');

class NotFound extends BaseError {
  constructor(message) {
    super(404, message);
  }
}

module.exports = NotFound;
