import { z } from 'zod';
import { stringToJSON } from './zod/stringToJson';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  STRIPE_SOURCERER_MONTHLY_PLAN: stringToJSON().pipe(
    z.object({
      price_id: z.string(),
      discount_percentage: z.coerce.number().optional(),
    }),
  ),
  STRIPE_SOURCERER_YEARLY_PLAN: stringToJSON().pipe(
    z.object({
      price_id: z.string(),
      discount_percentage: z.coerce.number().optional(),
    }),
  ),
  ENABLE_VENDOR_SURVEY_REMINDER: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true'),
  STRIPE_STARTER_CROMATIC_VENDOR_LISTING_PRICE_ID: z.string(),
  STRIPE_CROMATIC_VENDOR_LISTING_PRICE_ID: z.string(),
  CROMATIC_NOTIFY_SLACK_OAUTH_TOKEN: z.string(),
  CROMATIC_NOTIFY_SLACK_CHANNEL_ID: z.string(),
  AES_256_GCM_KEY: z.string().length(64),
  AES_256_GCM_IV: z.string().length(32),
});

export const env = envSchema.parse(process.env);
