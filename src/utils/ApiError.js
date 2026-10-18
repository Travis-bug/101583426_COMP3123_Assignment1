// Error with an HTTP status, thrown from controllers and caught by the central error handler.
class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = ApiError;
