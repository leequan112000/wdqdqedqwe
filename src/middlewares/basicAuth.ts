import { NextFunction, Request, Response } from "express";

const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    req.is_admin_authorized = false;
    return next();
  } else {
    const { ADMIN_BASIC_AUTH, CROMATIC_CONSULTANT_USER_ID } = process.env;

    const encoded = req.headers.authorization?.split(" ")[1];
    const decoded = Buffer.from(encoded, "base64").toString();

    if (decoded !== ADMIN_BASIC_AUTH) {
      req.is_admin_authorized = false;
      return next();
    }
    req.is_admin_authorized = true;
    if (CROMATIC_CONSULTANT_USER_ID) {
      req.consultant_user_id = CROMATIC_CONSULTANT_USER_ID;
    }
    return next();
  }
};

export default basicAuth;
