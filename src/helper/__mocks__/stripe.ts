import Stripe from 'stripe';
import { beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

beforeEach(() => {
  mockReset(stripe)
})

const stripe = mockDeep<Stripe>()
export default stripe
