import moment from 'moment';
import * as lodash from 'lodash';
import {
  ProjectConnection,
  ProjectRequest,
  Quote,
  User,
  VendorCompany,
} from '@prisma/client';
import { prisma } from '../prisma';
import { QuoteStatus } from '../helper/constant';
import { app_env } from '../environment';
import { bulkQuoteExpiredNoticeEmail } from '../mailer/quote';
import {
  NotificationJob,
  createNotificationQueueJob,
} from '../queues/notification.queues';
import { createExpiredQuoteNotificationJob } from '../notification/quoteNotification';

async function main() {
  const today = moment();
  const expiredQuotes = await prisma.quote.findMany({
    where: {
      status: {
        equals: QuoteStatus.PENDING_DECISION,
      },
      expired_at: {
        gte: today.startOf('d').toDate(),
        lte: today.endOf('d').toDate(),
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

  const expiredQuotesGroupByUserId: {
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

  expiredQuotes.forEach((quote) => {
    quote.project_connection.customer_connections.forEach((cc) => {
      const userId = cc.customer.user_id;
      if (
        cc.customer.user.deactivated_at === null ||
        cc.customer.user.deactivated_at > new Date()
      ) {
        if (!expiredQuotesGroupByUserId[userId]) {
          expiredQuotesGroupByUserId[userId] = {
            quotes: [],
            userData: cc.customer.user,
          };
        }
        expiredQuotesGroupByUserId[userId].quotes.unshift(quote);
      }
    });
  });

  const buttonUrl = `${app_env.APP_URL}/app/projects/on-going`;
  const emailData = Object.entries(expiredQuotesGroupByUserId).map(
    ([_, data]) => {
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
        emailData: {
          receiver_full_name: `${userData.first_name} ${userData.last_name}`,
          list_data: listData,
          more_count: moreCount,
          view_more_url: buttonUrl,
          button_url: buttonUrl,
        },
      };
    },
  );
  bulkQuoteExpiredNoticeEmail(emailData);
  const expiredQuoteNotificationJobData = Object.entries(
    expiredQuotesGroupByUserId,
  ).reduce<NotificationJob['data']>((acc, [_, data]) => {
    const { quotes, userData } = data;
    const jobs: NotificationJob['data'] = quotes.map((q) => {
      return createExpiredQuoteNotificationJob({
        project_connection_id: q.project_connection_id,
        project_name: q.project_connection.project_request.title,
        quote_id: q.id,
        recipient_id: userData.id,
        vendor_full_name: q.project_connection.vendor_company.name,
      });
    });
    return [...acc, ...jobs];
  }, []);
  const notificationTask = createNotificationQueueJob({
    data: expiredQuoteNotificationJobData,
  });

  await Promise.all([notificationTask]);

  process.exit(0);
}

main();
