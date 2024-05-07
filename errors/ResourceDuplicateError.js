export default class ResourceDuplicateError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message || 'Resource duplicated error.';
    this.name = 'ResourceDuplicateError';
    this.statusCode = statusCode || 409;
    this.errorCode = '001';
  }
}
