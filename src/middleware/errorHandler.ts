import { Request, Response, NextFunction } from 'express';
import { constants } from '../constants';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode);

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message || 'Invalid input data',
        stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message || 'Resource not found',
        stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message || 'Unauthorized access',
        stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message || 'Access forbidden',
        stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message || 'An unexpected error occurred',
        stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
      break;
    default:
      res.json({
        title: "Error",
        message: 'An unexpected error occurred',
        stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
      break;
  }
};

export default errorHandler;
