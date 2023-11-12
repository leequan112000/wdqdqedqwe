import { Resolvers } from "../generated";
import { Context } from "../../types/context";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createNews: async (parent, args, context) => {
      const {
        title,
        excerpt,
        external_link,
        is_featured,
        logo_url,
        cover_img_url,
        published_at,
      } = args;

      const news = await context.prisma.news.create({
        data: {
          title,
          excerpt,
          external_link,
          is_featured: is_featured != null ? is_featured : false,
          logo_url,
          type: "news",
          cover_img_url,
          published_at: published_at != null ? new Date(published_at) : undefined,
        },
      });

      return news;
    },
    updateNews: async (parent, args, context) => {
      const {
        news_id,
        title,
        excerpt,
        external_link,
        is_featured,
        logo_url,
        cover_img_url,
        published_at,
      } = args;

      const news = await context.prisma.news.update({
        data: {
          title: title !== null ? title : undefined,
          excerpt: excerpt !== null ? excerpt : undefined,
          external_link: external_link !== null ? excerpt : undefined,
          is_featured: is_featured != null ? is_featured : false,
          logo_url: logo_url !== null ? excerpt : undefined,
          type: "news",
          cover_img_url: cover_img_url !== null ? excerpt : undefined,
          published_at: published_at != null ? new Date(published_at) : undefined,
        },
        where: {
          id: news_id,
        },
      });

      return news;
    },
    publishNews: async (parent, args, context) => {
      const { news_id } = args;

      const news = await context.prisma.news.update({
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
