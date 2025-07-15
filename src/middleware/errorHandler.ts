import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// Error handling middleware
export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction): void => {
  // Log error with context
  logger.error('Unhandled error occurred', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Determine appropriate status code
  let statusCode = 500;
  let errorMessage = 'Internal server error';

  // Handle specific error types
  if (error.message.includes('Validation')) {
    statusCode = 400;
    errorMessage = error.message;
  } else if (error.message.includes('not found')) {
    statusCode = 404;
    errorMessage = error.message;
  } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
    statusCode = 403;
    errorMessage = error.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    timestamp: new Date().toISOString()
  });
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.url,
    ip: req.ip
  });

  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString()
  });
}; 