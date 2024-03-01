const dev = {
  APP_URL: 'http://localhost:3000',
  SERVER_URL: 'https://localhost:9000',
};
const staging = {
  APP_URL: 'https://staging.cromatic.bio',
  SERVER_URL: 'https://octavian-staging.onrender.com',
  AI_SERVER_URL: 'https://staging-ec2.cromatic.bio',
};
const prod = {
  APP_URL: 'https://www.cromatic.bio',
  SERVER_URL: 'https://octavian.herokuapp.com',
};

let env = dev;

if (process.env.NODE_ENV === 'production') {
  env = prod;
} else if (process.env.NODE_ENV === 'staging') {
  env = staging;
}

export const app_env = { ...env };
