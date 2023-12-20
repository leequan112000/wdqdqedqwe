import { Router, raw } from "express";
import { microsoftCallback } from "./microsoft";
import { googleCallback } from "./google";

export const router = Router();

router.get('/microsoft/callback', microsoftCallback);
router.get('/google/callback', googleCallback);

