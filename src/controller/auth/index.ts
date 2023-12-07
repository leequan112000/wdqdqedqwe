import { Router, raw } from "express";
import { microsoftCallback } from "./microsoft";

export const router = Router();

router.get('/microsoft/callback', microsoftCallback);

