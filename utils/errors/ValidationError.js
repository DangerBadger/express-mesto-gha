const BaseError = require('./BaseError');

class ValidationError extends BaseError {
  constructor(message) {
    super(400, message);
  }
}

module.exports = ValidationError;
