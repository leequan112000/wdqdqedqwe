import type { Prisma } from '@prisma/client';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';
import {
  AvailabilityDay,
  AvailabilityDayIndexObj,
} from '../../helper/constant';

const resolvers: Resolvers<Context> = {
  Query: {
    availability: async (_, args, context) => {
      const currentUserId = context.req.user_id;

      invariant(currentUserId, 'Missing user id');

      const availabilities = await context.prisma.availability.findMany({
        where: {
          user_id: currentUserId,
        },
      });

      /**
       * Transform database result to availability form value structure.
       */
      const result = availabilities.reduce<{
        timezone: string;
        rules: Array<
          | {
              day: string;
              intervals: Array<{ from: string; to: string }>;
            }
          | undefined
        >;
      }>(
        (acc, cur) => {
          // Make sure day of week fit the enum.
          invariant(
            Object.values(AvailabilityDay).includes(
              cur.day_of_week as AvailabilityDay,
            ),
            'Invalid day of week',
          );
          const draft = { ...acc };
          draft.timezone = cur.timezone;
          const dayIndex =
            AvailabilityDayIndexObj[cur.day_of_week as AvailabilityDay];
          if (draft.rules[dayIndex] === undefined) {
            draft.rules[dayIndex] = { day: cur.day_of_week, intervals: [] };
          } else {
            draft.rules[dayIndex]!.day = cur.day_of_week;
          }
          draft.rules[dayIndex]!.intervals.push({
            from: cur.start_time,
            to: cur.end_time,
          });
          return draft;
        },
        { timezone: '', rules: [] },
      );

      // Unset day indexes are undefined.
      // This code remove those undefined element in order to fit apollo schema type.
      const processedRule = result.rules.filter(
        (
          r,
        ): r is {
          day: string;
          intervals: Array<{
            from: string;
            to: string;
          }>;
        } => r !== undefined,
      );

      return {
        id: currentUserId,
        rules: processedRule,
        timezone: result.timezone,
      };
    },
  },
  Mutation: {
    saveAvailabilityRules: async (_, args, context) => {
      const { rules, timezone } = args.input;
      const currentUserId = context.req.user_id;

      invariant(currentUserId, 'Missing user id');

      // Flatten rules payload
      const availabilityCreateManyInputs = rules.reduce<
        Prisma.AvailabilityCreateManyInput[]
      >((acc, cur) => {
        const flattenOneRule = cur.intervals.reduce<
          Prisma.AvailabilityCreateManyInput[]
        >((acc2, cur2) => {
          // Make sure day of week fit the enum.
          invariant(
            Object.values(AvailabilityDay).includes(cur.day as AvailabilityDay),
            'Invalid day of week',
          );
          return [
            ...acc2,
            {
              user_id: currentUserId,
              day_of_week: cur.day,
              start_time: cur2.from,
              end_time: cur2.to,
              timezone,
            },
          ];
        }, []);
        return [...acc, ...flattenOneRule];
      }, []);

      await context.prisma.$transaction(async (trx) => {
        // Delete all the old rules.
        await trx.availability.deleteMany({
          where: {
            user_id: currentUserId,
          },
        });
        // Recreate with new rules.
        await context.prisma.availability.createMany({
          data: [...availabilityCreateManyInputs],
        });
      });

      return {
        id: currentUserId,
        rules,
        timezone,
      };
    },
  },
};

export default resolvers;
