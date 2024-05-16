export default class ValidationError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message || 'Validation error';
    this.name = 'ValidationError';
    this.statusCode = statusCode;
    this.errorCode = '002';
  }
}
