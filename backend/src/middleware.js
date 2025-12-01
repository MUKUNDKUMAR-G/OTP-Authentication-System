/**
 * Middleware for error handling and validation
 */

/**
 * Error handling middleware
 * Catches errors and returns consistent error responses
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  return res.status(statusCode).json({
    success: false,
    error: message,
    code: err.code,
    details: err.details,
  });
}

/**
 * Validation middleware for request body
 * Checks if required fields are present and have correct types
 */
export function validateRequestBody(requiredFields) {
  return (req, res, next) => {
    // Check if body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Request body is required',
        code: 'INVALID_REQUEST_BODY',
      });
    }
    
    // Check each required field
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`,
          code: 'MISSING_FIELD',
          details: { field },
        });
      }
      
      // Check if field is not null or undefined
      if (req.body[field] === null || req.body[field] === undefined) {
        return res.status(400).json({
          success: false,
          error: `Field cannot be null or undefined: ${field}`,
          code: 'INVALID_FIELD_VALUE',
          details: { field },
        });
      }
      
      // Check if field is a string (for our use case, all fields should be strings)
      if (typeof req.body[field] !== 'string') {
        return res.status(400).json({
          success: false,
          error: `Field must be a string: ${field}`,
          code: 'INVALID_FIELD_TYPE',
          details: { field, expectedType: 'string', actualType: typeof req.body[field] },
        });
      }
      
      // Check if string is not empty
      if (req.body[field].trim() === '') {
        return res.status(400).json({
          success: false,
          error: `Field cannot be empty: ${field}`,
          code: 'EMPTY_FIELD',
          details: { field },
        });
      }
    }
    
    next();
  };
}

/**
 * Not found handler
 * Returns 404 for undefined routes
 */
export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
  });
}
