const ApplicationError = require('./ApplicationError');

class NotFound extends ApplicationError {
  constructor(message) {
    super(404, message);
  }
}

module.exports = NotFound;
