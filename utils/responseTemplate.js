export function successResponse(res, data, statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data,
  });
}

export function errorResponse(res, errorMessage, statusCode = 500) {
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
}
