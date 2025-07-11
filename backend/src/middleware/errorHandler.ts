import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err.stack);

  let error = {
    message: err.message || 'Internal Server Error',
    status: 500,
  };

  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.status = 400;
  }

  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.status = 401;
  }

  if (err.name === 'SequelizeValidationError') {
    error.message = 'Validation Error';
    error.status = 400;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    error.message = 'Resource already exists';
    error.status = 409;
  }

  res.status(error.status).json({
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
