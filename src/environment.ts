const dev = {
  APP_URL: 'https://localhost:3000',
  APP_DOMAIN: 'localhost',
};
const prod = {
  APP_URL: 'https://platform.cro-matic.com',
  APP_DOMAIN: 'platform.cro-matic.com',
};
const staging = {
  APP_URL: 'https://caesar-staging.herokuapp.com/',
  APP_DOMAIN: 'caesar-staging.herokuapp.com',
};

let env = dev;

if (process.env.REACT_APP_ENV === 'production') {
  env = prod;
} else if (process.env.REACT_APP_ENV === 'staging') {
  env = staging;
}

export const app_env = { ...env };
