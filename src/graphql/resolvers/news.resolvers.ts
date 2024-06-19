import { app_env } from '../../environment';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import ghostServices from '../../services/ghost/ghost.service';

const resolvers: Resolvers<Context> = {
  Query: {
    news: async (parent, args, context) => {
      const internalNews = await ghostServices.getAllNews();
      const blogNews = await ghostServices.getAllBlogNews();

      const processedInternalNews = internalNews.map((n) => {
        return {
          title: n.title,
          excerpt: n.excerpt,
          is_featured: n.featured,
          published_at: n.published_at ? new Date(n.published_at) : undefined,
          url: new URL(`/news/${n.slug}`, app_env.APP_URL).href,
          cover_img_url: n.feature_image,
        };
      });

      const processedBlogNews = blogNews.map((n) => {
        return {
          title: n.title,
          excerpt: n.excerpt,
          is_featured: n.featured,
          published_at: n.published_at ? new Date(n.published_at) : undefined,
          url: new URL(`/news/${n.slug}`, app_env.APP_URL).href,
          cover_img_url: n.feature_image,
        };
      });

      const externalNews = await context.prisma.news.findMany({
        where: {
          is_featured: false,
          published_at: {
            lte: new Date(),
          },
          is_published: true,
        },
        orderBy: {
          published_at: 'desc',
        },
      });

      return [
        ...processedInternalNews,
        ...processedBlogNews,
        ...externalNews,
      ].sort((n1, n2) => {
        if (n2.published_at! > n1.published_at!) {
          return 1;
        }
        if (n2.published_at! < n1.published_at!) {
          return -1;
        }
        return 0;
      });
    },
    featuredNews: async (parent, args, context) => {
      const internalNews = await ghostServices.getAllFeaturedNews();

      const processedInternalNews = internalNews.map((n) => {
        return {
          title: n.title,
          excerpt: n.excerpt,
          is_featured: n.featured,
          published_at: n.published_at ? new Date(n.published_at) : undefined,
          url: new URL(`/news/${n.slug}`, app_env.APP_URL).href,
          cover_img_url: n.feature_image,
        };
      });

      const externalNews = await context.prisma.news.findMany({
        where: {
          is_featured: true,
          published_at: {
            lte: new Date(),
          },
          is_published: true,
        },
        orderBy: {
          published_at: 'desc',
        },
      });

      return [...processedInternalNews, ...externalNews];
    },
  },
};

export default resolvers;
