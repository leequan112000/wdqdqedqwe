import ReactGA from "react-ga4";
import { GA4 } from "react-ga4/types/ga4";

const ga4 = (): GA4 => {
  if (process.env.GA_MEASUREMENT_ID) {
    ReactGA.initialize(process.env.GA_MEASUREMENT_ID!);
  }

  return ReactGA;
};

export const ga = ga4();