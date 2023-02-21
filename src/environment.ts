const dev = {
  APP_URL: 'https://localhost:3000',
};
const prod = {
  APP_URL: 'https://cro-matic.com',
};
const staging = {
  APP_URL: 'https://cromatic-staging.herokuapp.com/',
};

let env = dev;

if (process.env.REACT_APP_ENV === 'production') {
  env = prod;
} else if (process.env.REACT_APP_ENV === 'staging') {
  env = staging;
}

export const app_env = { ...env };
