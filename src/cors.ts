let origin: string[] = [];

// Loosen CORS for development and staging
if (process.env.NODE_ENV === 'production') {
  origin = [
    'https://caesar.herokuapp.com',
    'https://platform.cro-matic.com',
    'https://www.cro-matic.com',
    'https://www.cromatic.bio',
    'https://octavian.cromatic.bio',
    'https://octavian.onrender.bio',
  ];
} else if (process.env.NODE_ENV === 'staging') {
  origin = [
    'https://staging.cromatic.bio',
    'https://octavian-staging.onrender.com',
  ];
} else {
  origin = [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:9000',
    'https://localhost:9000',
    'https://studio.apollographql.com',
    'https://octavian-test-85ec4e8ad99d.herokuapp.com',
    'https://github.com',
  ];
}

const corsConfig = {
  origin,
  credentials: true,
};

export default corsConfig;
