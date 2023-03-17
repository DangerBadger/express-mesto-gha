const ApplicationError = require('./ApplicationError');

class ValidationError extends ApplicationError {
  constructor(message) {
    super(400, message);
  }
}

module.exports = ValidationError;
