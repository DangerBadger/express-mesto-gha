const ApplicationError = require('./ApplicationError');

class BadRequest extends ApplicationError {
  constructor(message) {
    super(400, message);
  }
}

module.exports = BadRequest;
