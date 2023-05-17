const dev = {
  APP_URL: 'https://localhost:3000',
  SERVER_URL: 'https://localhost:9000',
};
const staging = {
  APP_URL: 'https://caesar-staging.herokuapp.com',
  SERVER_URL: 'https://octavian-staging.herokuapp.com',
};
const prod = {
  APP_URL: 'https://www.cro-matic.com',
  SERVER_URL: 'https://octavian.herokuapp.com',
};

let env = dev;

if (process.env.NODE_ENV === 'production') {
  env = prod;
} else if (process.env.NODE_ENV === 'staging') {
  env = staging;
}

export const app_env = { ...env };
