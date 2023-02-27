let origin: string[] = [];

// Loosen CORS for development and staging
if (process.env.NODE_ENV === 'production') {
  origin = [ 'https://cro-matic.com' ];
} else {
  origin = [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:9000',
    'https://localhost:9000',
    'https://cromatic-staging.herokuapp.com',
    'https://studio.apollographql.com',
  ];
}

const corsConfig = {
  origin,
  credentials: true,
};

export default corsConfig;
