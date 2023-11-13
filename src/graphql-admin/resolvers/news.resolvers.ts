import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import invariant from "../../helper/invariant";
import { PublicError } from "../../graphql/errors/PublicError";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createNews: async (parent, args, context) => {
      const {
        title,
        excerpt,
        url,
        is_featured,
        logo_url,
        cover_img_url,
        published_at,
      } = args;

      const news = await context.prisma.news.create({
        data: {
          title,
          excerpt,
          url,
          is_featured: is_featured != null ? is_featured : false,
          logo_url,
          cover_img_url,
          published_at:
            published_at != null ? new Date(published_at) : undefined,
        },
      });

      return news;
    },
    updateNews: async (parent, args, context) => {
      const {
        news_id,
        title,
        excerpt,
        url,
        is_featured,
        logo_url,
        cover_img_url,
        published_at,
      } = args;

      const news = await context.prisma.news.update({
        data: {
          title: title !== null ? title : undefined,
          excerpt: excerpt !== null ? excerpt : undefined,
          url: url !== null ? url : undefined,
          is_featured: is_featured != null ? is_featured : false,
          logo_url: logo_url !== null ? logo_url : undefined,
          cover_img_url: cover_img_url !== null ? cover_img_url : undefined,
          published_at:
            published_at != null ? new Date(published_at) : undefined,
        },
        where: {
          id: news_id,
        },
      });

      return news;
    },
    publishNews: async (parent, args, context) => {
      const { news_id } = args;

      const news = await context.prisma.news.findUnique({
        where: {
          id: news_id,
        },
      });

      invariant(news?.url, new PublicError("News doesn't has URL."));

      await context.prisma.news.update({
        where: {
          id: news_id,
        },
        data: {
          is_published: true,
        },
      });

      return news;
    },
    unpublishNews: async (parent, args, context) => {
      const { news_id } = args;

      const news = await context.prisma.news.update({
        where: {
          id: news_id,
        },
        data: {
          is_published: false,
        },
      });

      return news;
    },
    removeNews: async (parent, args, context) => {
      const { news_id } = args;

      const news = await context.prisma.news.delete({
        where: {
          id: news_id,
        },
      });

      return news;
    },
  },
};

export default resolvers;
