import { NextFunction, Request, Response } from 'express';
import Sentry from '../sentry';

const sentryMiddleware = (req: Request, _: Response, next: NextFunction) => {
  if (req.user_id) {
    Sentry.setUser({
      id: req.user_id,
    });
  }
  next();
};

export default sentryMiddleware;
