import ValidationError from '../errors/validationError.js';
import { errorResponse } from '../utils/responseTemplate.js';

/* eslint-disable-next-line no-unused-vars */
export default function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return errorResponse(res, err.message, err.statusCode);
  }
  return errorResponse(res, err.message, err.statusCode);
}
