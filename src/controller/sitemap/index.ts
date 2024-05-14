import { Router, raw } from "express";
import { vendorServicesQuery } from "./vendor-services";

export const router = Router();

router.get('/vendor-services', vendorServicesQuery);
