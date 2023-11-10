import { app_env } from "../../environment";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";

const resolvers: Resolvers<Context> = {
  News: {
    url: (parent) => {
      const { external_link, ghost_slug } = parent

      if (ghost_slug) {
        return new URL(`/news/${ghost_slug}`, app_env.APP_URL).href;
      }

      if (external_link) {
        return external_link
      }

      return null;
    },
  },
  Query: {
    news: async (parent, args, context) => {
      const news = await context.prisma.news.findMany({
        where: {
          is_featured: false,
          published_at: {
            not: null,
          },
        },
        orderBy: {
          published_at: "desc",
        },
      });

      return news;
    },
    featuredNews: async (parent, args, context) => {
      const news = await context.prisma.news.findMany({
        where: {
          is_featured: true,
          published_at: {
            not: null,
          },
        },
        orderBy: {
          published_at: "desc",
        },
      });

      return news;
    },
  },
};

export default resolvers;
