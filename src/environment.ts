const dev = {
  APP_URL: 'https://localhost:3000',
};
const prod = {
  APP_URL: 'https://platform.cro-matic.com',
};
const staging = {
  APP_URL: 'https://caesar-staging.herokuapp.com/',
};

let env = dev;

if (process.env.NODE_ENV === 'production') {
  env = prod;
} else if (process.env.NODE_ENV === 'staging') {
  env = staging;
}

export const app_env = { ...env };
