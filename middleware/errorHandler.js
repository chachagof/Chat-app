import { errorResponse } from '../utils/responseTemplate.js';
import logger from '../logger/logger.js';

/* eslint-disable no-unused-vars */
export default function errorHandler(err, req, res, next) {
  logger.error(err.stack);
  return errorResponse(res, err);
}
