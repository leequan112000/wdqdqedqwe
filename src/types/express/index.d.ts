import * as express from "express"
declare global {
  namespace Express {
    interface Request {
      user_id?: string;
      is_admin_authorized?: boolean;
      consultant_user_id: string;
    }
  }
}
