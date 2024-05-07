export function successResponse(res, data, statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data,
  });
}

export function errorResponse(res, err) {
  const { statusCode, errorCode, message } = err;
  res.status(statusCode || 500).json({
    success: false,
    error: errorCode ? message : 'Internal Server Error',
    errorCode: errorCode || '-1',
  });
}
