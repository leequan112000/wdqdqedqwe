let origin: string[] = [];

// Loosen CORS for development and staging
if (process.env.NODE_ENV === 'production') {
  origin = [ 'https://platform.cro-matic.com' ];
} else if (process.env.NODE_ENV === 'staging') {
  origin = [
    'https://caesar-staging.herokuapp.com',
    'https://octavian-staging.herokuapp.com',
  ];
} else {
  origin = [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:9000',
    'https://localhost:9000',
    'https://studio.apollographql.com',
  ];
}

const corsConfig = {
  origin,
  credentials: true,
};

export default corsConfig;
