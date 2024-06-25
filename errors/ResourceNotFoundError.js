export default class ResourceNotFoundError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message || 'ResourceNotFoundError';
    this.name = 'ResourceNotFoundError';
    this.statusCode = statusCode || 404;
    this.errorCode = '003';
  }
}
