import moment from 'moment';
import * as lodash from 'lodash';
import { prisma } from '../prisma';
import { createSendUserExpiringQuoteNoticeEmailJob } from '../queues/email.queues';
import { CreateSendUserExpiringQuoteNoticeEmailJobParam } from '../queues/types';
import { QuoteStatus } from '../helper/constant';
import {
  ProjectConnection,
  ProjectRequest,
  Quote,
  User,
  VendorCompany,
} from '@prisma/client';
import {
  NotificationJob,
  createNotificationQueueJob,
} from '../queues/notification.queues';
import { createExpiringQuoteNotificationJob } from '../notification/quoteNotification';

const EXPIRING_DAYS = 3;

async function main() {
  const today = moment();
  const expiringDate = today.clone().add(EXPIRING_DAYS, 'd');
  const expiringQuotes = await prisma.quote.findMany({
    where: {
      status: {
        equals: QuoteStatus.PENDING_DECISION,
      },
      expired_at: {
        gte: expiringDate.startOf('d').toDate(),
        lte: expiringDate.endOf('d').toDate(),
      },
    },
    include: {
      project_connection: {
        include: {
          project_request: true,
          vendor_company: true,
          customer_connections: {
            include: {
              customer: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const expiringQuotesGroupByUserId: {
    [userId: string]: {
      quotes: (Quote & {
        project_connection: ProjectConnection & {
          project_request: ProjectRequest;
          vendor_company: VendorCompany;
        };
      })[];
      userData: User;
    };
  } = {};

  expiringQuotes.forEach((quote) => {
    quote.project_connection.customer_connections.forEach((cc) => {
      const userId = cc.customer.user_id;
      if (
        cc.customer.user.deactivated_at === null ||
        cc.customer.user.deactivated_at > new Date()
      ) {
        if (!expiringQuotesGroupByUserId[userId]) {
          expiringQuotesGroupByUserId[userId] = {
            quotes: [],
            userData: cc.customer.user,
          };
        }
        expiringQuotesGroupByUserId[userId].quotes.unshift(quote);
      }
    });
  });

  const toSendQuoteExpiringEmailData: CreateSendUserExpiringQuoteNoticeEmailJobParam[] =
    Object.entries(expiringQuotesGroupByUserId).map(([_, data]) => {
      const { quotes, userData } = data;
      const quotesGroupByProject = lodash.groupBy(
        quotes,
        (q) => q.project_connection.project_request.title,
      );

      const listData = Object.entries(quotesGroupByProject).map(
        ([title, data]) => {
          return {
            project_request_title: title,
            quotes: data.map((d) => {
              return {
                short_id: d.short_id,
                vendor_full_name: d.project_connection.vendor_company.name,
              };
            }),
          };
        },
      );

      const moreCount = listData.length > 2 ? listData.length - 2 : undefined;

      return {
        receiverEmail: userData.email,
        receiverName: `${userData.first_name} ${userData.last_name}`,
        listData: listData.slice(0, 2),
        expiringIn: `${EXPIRING_DAYS} days`,
        moreCount,
      };
    });

  const expiringQuoteTasks = toSendQuoteExpiringEmailData.map((d) => {
    return createSendUserExpiringQuoteNoticeEmailJob(d);
  });

  const expiringQuoteNotificationJobData = Object.entries(
    expiringQuotesGroupByUserId,
  ).reduce<NotificationJob['data']>((acc, [_, data]) => {
    const { quotes, userData } = data;
    const jobs: NotificationJob['data'] = quotes.map((q) => {
      return createExpiringQuoteNotificationJob({
        project_connection_id: q.project_connection_id,
        project_name: q.project_connection.project_request.title,
        quote_id: q.id,
        recipient_id: userData.id,
        vendor_full_name: q.project_connection.vendor_company.name,
        expiring_in: `${EXPIRING_DAYS} days`,
      });
    });
    return [...acc, ...jobs];
  }, []);
  const notificationTask = createNotificationQueueJob({
    data: expiringQuoteNotificationJobData,
  });

  await Promise.all([...expiringQuoteTasks, notificationTask]);
  process.exit(0);
}

main();
