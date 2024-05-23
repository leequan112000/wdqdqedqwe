import { z } from 'zod'
import type { json } from './json'

const stringToJSONSchema = z.string()
  .transform((str, ctx): z.infer<ReturnType<typeof json>> => {
    try {
      return JSON.parse(str)
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
      return z.NEVER
    }
  })

export const stringToJSON = () => stringToJSONSchema;
