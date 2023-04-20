import { NextFunction, Request, Response } from "express";

const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    req.is_admin_authorized = false;
    return next();
  } else {
    const { ADMIN_BASIC_AUTH } = process.env;

    const encoded = req.headers.authorization?.split(' ')[1]
    const decoded = Buffer.from(encoded, 'base64').toString();

    if (decoded !== ADMIN_BASIC_AUTH) {
      req.is_admin_authorized = false;
      return next();
    }
    req.is_admin_authorized = true;
    return next();
  }
}

export default basicAuth;
