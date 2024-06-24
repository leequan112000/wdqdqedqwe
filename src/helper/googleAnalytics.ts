import Sentry from '../sentry';

const trackEvent = async (event: string, client_id: string, params: any) => {
  const MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
  const API_SECRET = process.env.GA_API_SECRET;

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id,
          events: [
            {
              name: event,
              params: params,
            },
          ],
        }),
      },
    );
  } catch (error) {
    Sentry.captureException(error);
  }
};

export const ga = {
  trackEvent,
};
