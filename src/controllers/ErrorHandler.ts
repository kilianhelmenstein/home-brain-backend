import express, { Request, Response, NextFunction } from 'express';

export class StatusCodeError extends Error {
  constructor(public statusCode: number, public message: string) {
    super();
  }
}

export default function(err: StatusCodeError, req: Request, res: Response, next: NextFunction) {
  res.status(err.statusCode || 500).json({
     status: 'error',
     statusCode: err.statusCode,
     message: err.message
  });
};
