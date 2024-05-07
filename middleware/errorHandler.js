/* eslint-disable no-unused-vars */
import { errorResponse } from '../utils/responseTemplate.js';

export default function errorHandler(err, req, res, next) {
  console.log(err.stack);
  return errorResponse(res, err);
}
