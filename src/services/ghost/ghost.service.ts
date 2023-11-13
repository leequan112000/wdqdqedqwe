import GhostContentAPI from "@tryghost/content-api";

const ghostApi = new GhostContentAPI({
  url: process.env.GHOST_API_URL!,
  key: process.env.GHOST_CONTENT_API_KEY!,
  version: "v5.0",
});

const getAllFeaturedNews = async () => {
  const posts = await ghostApi.posts.browse({
    limit: "all",
    filter: "tag:news+featured:true",
  });
  return posts;
};

const getAllNews = async () => {
  const posts = await ghostApi.posts.browse({
    limit: "all",
    filter: "tag:news+featured:false",
  });
  return posts;
};

const getAllBlogNews = async () => {
  const posts = await ghostApi.posts.browse({
    limit: "all",
    filter: "tag:blognews",
  });
  return posts;
}

const ghostServices = {
  getAllFeaturedNews,
  getAllNews,
  getAllBlogNews,
};

export default ghostServices;
