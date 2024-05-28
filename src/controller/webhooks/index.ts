import { Router, raw } from "express";
import multer from "multer";
import { getStripeInstance } from "../../helper/stripe";
import invariant from "../../helper/invariant";
import { cromaticAiWebhook } from "./cromatic-ai";
import { processStripeEvent } from './stripe/stripe';
import { zohoWebhook } from "./zoho";

export const router = Router();
const upload = multer();

router.post('/stripe', raw({ type: 'application/json' }), async (req, res) => {
  const stripe = await getStripeInstance();
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  invariant(endpointSecret, 'Stripe webhook secret is undefined.');

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    const { message, status } = await processStripeEvent(event);
    res.status(status).json({ status, message });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ status: 400, message: `Webhook Error: ${error.message}` });
    } else {
      res.status(400).json({ status: 400, message: 'Webhook Error' });
    }
  }
  return;
});

router.post('/zoho', upload.single('content'), zohoWebhook);

router.post('/cromatic-ai', raw({ type: 'application/json' }), cromaticAiWebhook);
