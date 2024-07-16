import { withFilter } from 'graphql-subscriptions';
import { Resolvers } from '../generated';
import { Context } from '../../types/context';
import sourcererService from '../../services/sourcerer/sourcerer.service';
import { CountryRegion, SourcingResultSortBy } from '../../helper/constant';
import { deleteObject, getSignedUrl } from '../../helper/awsS3';
import { formatBytes } from '../../helper/filesize';
import { countryRegionMap, getRegionByCountryCode } from '../../helper/country';
import invariant from '../../helper/invariant';
import { pubsub } from '../../helper/pubsub';
import { PublicError } from '../errors/PublicError';
import { Prisma } from '../../../prisma-cro/generated/client';
import { hasField } from '../../helper/resolverInfo';

const resolvers: Resolvers<Context> = {
  SourcingSession: {
    user: async (parent, _, context) => {
      invariant(parent.user_id, 'Missing user id.');
      return await context.prisma.user.findUnique({
        where: {
          id: parent.user_id,
        },
      });
    },
    sourcing_subspecialties: async (parent, _, context) => {
      if (parent.sourcing_subspecialties) return parent.sourcing_subspecialties;
      invariant(parent.id, 'Missing session id.');
      return await context.prismaCRODb.sourcingSession
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .sourcing_subspecialties();
    },
    sourcing_attachments: async (parent, _, context) => {
      invariant(parent.id, 'Missing session id.');
      const attachments = await context.prismaCRODb.sourcingSession
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .sourcing_attachments();

      return (attachments ?? []).map((a) => ({
        ...a,
        byte_size: Number(a.byte_size),
      }));
    },
    shortlisted_cros: async (parent, _, context, info) => {
      invariant(parent.id, 'Missing session id.');
      return (
        (await context.prismaCRODb.sourcingSession
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .sourced_cros({
            where: {
              is_shortlisted: true,
            },
            orderBy: {
              score: 'desc',
            },
            include: {
              vendor_company: {
                include: {
                  vendor_company_locations: hasField(
                    info,
                    'vendor_company_locations',
                  ),
                  vendor_company_subspecialties: {
                    include: {
                      subspecialty: hasField(info, 'subspecialty'),
                    },
                  },
                  vendor_company_types: hasField(info, 'vendor_company_types'),
                  vendor_company_certifications: hasField(
                    info,
                    'vendor_company_certifications',
                  ),
                },
              },
            },
          })) || []
      );
    },
    sourced_cros: async (parent, _, context, info) => {
      if (parent.sourced_cros) return parent.sourced_cros;

      invariant(parent.id, 'Missing session id.');

      return await context.prismaCRODb.sourcingSession
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .sourced_cros({
          orderBy: {
            score: 'desc',
          },
          include: {
            vendor_company: {
              include: {
                vendor_company_locations: hasField(
                  info,
                  'vendor_company_locations',
                ),
                vendor_company_subspecialties: {
                  include: {
                    subspecialty: hasField(info, 'subspecialty'),
                  },
                },
                vendor_company_types: hasField(info, 'vendor_company_types'),
                vendor_company_certifications: hasField(
                  info,
                  'vendor_company_certifications',
                ),
              },
            },
          },
        });
    },
  },
  SourcingSubspecialty: {
    sourcing_session: async (parent, _, context) => {
      invariant(parent.sourcing_session_id, 'Missing session id.');
      return await context.prismaCRODb.sourcingSession.findUnique({
        where: {
          id: parent.sourcing_session_id,
        },
      });
    },
  },
  SourcingAttachment: {
    signed_url: async (parent) => {
      invariant(parent.key, 'Key not found.');
      return await getSignedUrl(parent.key);
    },
    formatted_filesize: async (parent) => {
      if (parent.byte_size) {
        return formatBytes(parent.byte_size);
      }
      return null;
    },
    sourcing_session: async (parent, _, context) => {
      if (parent.sourcing_session_id) {
        return await context.prismaCRODb.sourcingSession.findUnique({
          where: {
            id: parent.sourcing_session_id,
          },
        });
      }
      return null;
    },
  },
  SourcedCro: {
    sourcing_session: async (parent, _, context) => {
      invariant(parent.sourcing_session_id, 'Missing session id.');
      return await context.prismaCRODb.sourcingSession.findUnique({
        where: {
          id: parent.sourcing_session_id,
        },
      });
    },
    vendor_company: async (parent, _, context) => {
      if (parent.vendor_company) return parent.vendor_company;

      invariant(parent.vendor_company_id, 'Missing vendor company id.');
      return await context.prismaCRODb.vendorCompany.findUnique({
        where: {
          id: parent.vendor_company_id,
        },
      });
    },
  },
  Query: {
    sourcingSession: async (_, args, context) => {
      const { id } = args;
      const sourcingSession =
        await context.prismaCRODb.sourcingSession.findFirst({
          where: {
            id,
            user_id: context.req.user_id,
          },
        });

      invariant(
        sourcingSession,
        new PublicError('Sourcing session not found.'),
      );

      return sourcingSession;
    },
    sourcingSessions: async (_, __, context) => {
      const sessions = await context.prismaCRODb.sourcingSession.findMany({
        where: {
          user_id: context.req.user_id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return sessions;
    },
    sourcedCros: async (_, args, context, info) => {
      const { first, after, sortBy, filterCountryBy, sourcing_session_id } =
        args;

      const sourcedCroFilter: Prisma.SourcedCroWhereInput = {
        vendor_company: {
          NOT: {
            company_description: null,
            company_ipo_status: null,
          },
          is_active: true,
          ...(!filterCountryBy || filterCountryBy === CountryRegion.ALL
            ? {}
            : {
                vendor_company_locations: {
                  some: {
                    country: {
                      in: Object.keys(countryRegionMap).filter(
                        (countryCode) =>
                          getRegionByCountryCode(countryCode) ===
                          filterCountryBy,
                      ),
                    },
                  },
                },
              }),
        },
      };

      const sourcingSession =
        await context.prismaCRODb.sourcingSession.findUnique({
          where: {
            id: sourcing_session_id,
          },
          include: {
            _count: {
              select: {
                sourced_cros: {
                  where: sourcedCroFilter,
                },
              },
            },
          },
        });

      const total_count = sourcingSession!._count.sourced_cros;

      const sourcedCroSorting: Prisma.SourcedCroOrderByWithRelationInput =
        (() => {
          switch (sortBy) {
            case SourcingResultSortBy.ALPHABETICAL:
              return { name: 'asc' };
            case SourcingResultSortBy.REVENUE:
              return { vendor_company: { company_revenue_value: 'desc' } };
            case SourcingResultSortBy.TEAM_SIZE:
              return { vendor_company: { company_average_size: 'desc' } };
            case SourcingResultSortBy.BEST_MATCH:
            default:
              return { score: 'desc' };
          }
        })();

      const sourcedCros =
        (await context.prismaCRODb.sourcingSession
          .findUnique({
            where: {
              id: sourcing_session_id,
            },
          })
          .sourced_cros({
            take: first,
            skip: after ? 1 : undefined, // Skip the cursor
            cursor: after ? { id: after } : undefined,
            orderBy: sourcedCroSorting,
            where: sourcedCroFilter,
            include: {
              vendor_company: {
                include: {
                  vendor_company_locations: hasField(
                    info,
                    'vendor_company_locations',
                  ),
                  vendor_company_subspecialties: {
                    include: {
                      subspecialty: hasField(info, 'subspecialty'),
                    },
                  },
                  vendor_company_types: hasField(info, 'vendor_company_types'),
                  vendor_company_certifications: hasField(
                    info,
                    'vendor_company_certifications',
                  ),
                },
              },
            },
          })) || [];

      const edges = sourcedCros.map((c) => ({
        cursor: c.id,
        node: c,
      }));

      const endCursor =
        edges.length > 0 ? edges[edges.length - 1].cursor : null;
      let hasNextPage = false;

      if (endCursor) {
        const nextSourcedCros =
          (await context.prismaCRODb.sourcingSession
            .findUnique({
              where: {
                id: sourcing_session_id,
              },
            })
            .sourced_cros({
              take: first,
              skip: 1,
              cursor: { id: endCursor },
              orderBy: sourcedCroSorting,
              where: sourcedCroFilter,
            })) || [];
        hasNextPage = nextSourcedCros.length > 0;
      }

      return {
        edges,
        page_info: {
          end_cursor: endCursor || '',
          has_next_page: hasNextPage,
          total_count,
        },
      };
    },
  },
  Mutation: {
    extractPdfRfp: async (_, args, context) => {
      invariant(context.req.user_id, new PublicError('User not found.'));

      const { file, sourcing_session_id } = args;
      const data = await file;

      return await sourcererService.extractPdfToRfp(
        {
          file: data,
          user_id: context.req.user_id,
          sourcing_session_id: sourcing_session_id as string,
        },
        context,
      );
    },
    sourceRfpSpecialties: async (_, args, context) => {
      invariant(context.req.user_id, new PublicError('User not found.'));
      return await sourcererService.sourceRfpSpecialties(
        {
          ...args,
          num_specialties: 5,
          user_id: context.req.user_id,
        },
        context,
      );
    },
    sourceCros: async (_, args, context) => {
      invariant(context.req.user_id, new PublicError('User not found.'));

      return await sourcererService.sourceCros(
        {
          ...args,
        },
        context,
      );
    },
    shortlistSourcedCro: async (_, args, context) => {
      const { sourcing_session_id, sourced_cro_id } = args;
      invariant(context.req.user_id, new PublicError('User not found.'));

      return await context.prismaCRODb.sourcedCro.update({
        where: {
          id: sourced_cro_id,
          sourcing_session_id,
        },
        data: {
          is_shortlisted: true,
        },
      });
    },
    removeSourcedCroFromShortlist: async (_, args, context) => {
      const { sourcing_session_id, sourced_cro_id } = args;
      invariant(context.req.user_id, new PublicError('User not found.'));

      return await context.prismaCRODb.sourcedCro.update({
        where: {
          id: sourced_cro_id,
          sourcing_session_id,
        },
        data: {
          is_shortlisted: false,
        },
      });
    },
    confirmEditSourcingDetails: async (_, args, context) => {
      const { sourcing_session_id } = args;
      return await context.prismaCRODb.$transaction(async (trx) => {
        await trx.sourcingSubspecialty.deleteMany({
          where: {
            sourcing_session_id: sourcing_session_id,
          },
        });

        await trx.sourcedCro.deleteMany({
          where: {
            sourcing_session_id,
          },
        });

        return await trx.sourcingSession.findUnique({
          where: {
            id: sourcing_session_id,
          },
        });
      });
    },
    confirmEditSourcingSubspecialties: async (_, args, context) => {
      const { sourcing_session_id } = args;

      return await context.prismaCRODb.$transaction(async (trx) => {
        await trx.sourcedCro.deleteMany({
          where: {
            sourcing_session_id,
          },
        });

        return await trx.sourcingSession.findUnique({
          where: {
            id: sourcing_session_id,
          },
        });
      });
    },
    cancelAiTask: async (_, args, context) => {
      const { task_id, sourcing_session_id } = args;

      const resp = await sourcererService.revokeAiTask(
        {
          task_id,
          sourcing_session_id,
        },
        context,
      );

      return resp;
    },
    confirmRemoveSourcingSession: async (_, args, context) => {
      const { sourcing_session_id } = args;

      return await context.prismaCRODb.$transaction(async (trx) => {
        const sourcingAttachments = await trx.sourcingAttachment.findMany({
          where: {
            sourcing_session_id,
          },
        });

        const deletedSourcingSession = await trx.sourcingSession.delete({
          where: {
            id: sourcing_session_id,
          },
        });

        const deleteS3Tasks = sourcingAttachments.map((attachment) => {
          return deleteObject(attachment.key);
        });

        await Promise.all(deleteS3Tasks);

        return deletedSourcingSession;
      });
    },
  },
  Subscription: {
    sourceRfpSpecialties: {
      // @ts-ignore
      subscribe: withFilter(
        () => pubsub.asyncIterator(['SOURCE_RFP_SPECIALTIES']),
        (payload, variables) => {
          return payload.sourceRfpSpecialties.task_id === variables.task_id;
        },
      ),
    },
    sourceCros: {
      // @ts-ignore
      subscribe: withFilter(
        () => pubsub.asyncIterator<any>(['SOURCE_CROS']),
        (payload, variables) => {
          return payload.sourceCros.task_id === variables.task_id;
        },
      ),
    },
  },
};

export default resolvers;
