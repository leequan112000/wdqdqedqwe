const dev = {
  APP_URL: 'http://localhost:3000',
  SERVER_URL: 'https://localhost:9000',
  AI_SERVER_URL: 'http://localhost:8080',
};
const staging = {
  APP_URL: 'https://staging.cromatic.bio',
  SERVER_URL: 'https://octavian-staging.onrender.com',
  AI_SERVER_URL: 'https://staging-ec2.cromatic.bio',
};
const prod = {
  APP_URL: 'https://www.cromatic.bio',
  SERVER_URL: 'https://octavian.cromatic.bio',
  AI_SERVER_URL: 'https://ai.cromatic.bio',
};

let env = dev;

if (process.env.APP_ENV === 'production') {
  env = prod;
} else if (process.env.APP_ENV === 'staging') {
  env = staging;
}

export const app_env = { ...env };
