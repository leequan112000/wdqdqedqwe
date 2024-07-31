import { z } from 'zod';
import { stringToJSON } from './zod/stringToJson';

const envSchema = z.object({
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
});

export const env = envSchema.parse(process.env);
