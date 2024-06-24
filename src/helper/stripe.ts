async function loadStripe() {
  const { default: Stripe } = await import('stripe');

  return Stripe;
}

async function getStripeEmulatorInstance() {
  const Stripe = await loadStripe();

  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    host: `localhost`,
    port: 12111,
    apiVersion: '2022-11-15',
    protocol: `http`,
    typescript: true,
  });
}

async function getStripeProductionInstance() {
  const Stripe = await loadStripe();
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2022-11-15',
    typescript: true,
  });
}

function isCypressEnv() {
  return Boolean(
    process.env.APP_ENV === `development` &&
      process.env.STRIPE_EMULATOR === `true`,
  );
}

export async function getStripeInstance() {
  if (isCypressEnv()) {
    console.warn(`Stripe is running in Testing mode`);

    return getStripeEmulatorInstance();
  }

  return getStripeProductionInstance();
}
