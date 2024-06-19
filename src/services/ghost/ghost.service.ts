import GhostContentAPI from '@tryghost/content-api';

const env = process.env.APP_ENV === 'production' ? 'production' : 'staging';

const ghostApi = new GhostContentAPI({
  url: process.env.GHOST_API_URL!,
  key: process.env.GHOST_CONTENT_API_KEY!,
  version: 'v5.0',
});

const getAllFeaturedNews = async () => {
  const posts = await ghostApi.posts.browse({
    limit: 'all',
    filter: `tag:news+tag:${env}+featured:true`,
  });
  return posts;
};

const getAllNews = async () => {
  const posts = await ghostApi.posts.browse({
    limit: 'all',
    filter: `tag:news+tag:${env}+featured:false`,
  });
  return posts;
};

const getAllBlogNews = async () => {
  const posts = await ghostApi.posts.browse({
    limit: 'all',
    filter: `tag:blognews+tag:${env}`,
  });
  return posts;
};

const ghostServices = {
  getAllFeaturedNews,
  getAllNews,
  getAllBlogNews,
};

export default ghostServices;
