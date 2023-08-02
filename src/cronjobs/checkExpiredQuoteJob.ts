import moment from 'moment';
import { prisma } from '../connectDB';
import { createSendUserExpiredQuoteNoticeEmailJob } from '../queues/email.queues';
import { CreateSendUserExpiredQuoteNoticeEmailJobParam } from '../queues/types';
import { QuoteStatus } from '../helper/constant';
import { ProjectConnection, ProjectRequest, Quote, User, VendorCompany } from '@prisma/client';
import { NotificationJob, createNotificationQueueJob } from '../queues/notification.queues';
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
      quotes: (Quote & { project_connection: ProjectConnection & { project_request: ProjectRequest; vendor_company: VendorCompany } })[];
      userData: User;
    };
  } = {}

  expiredQuotes.forEach((quote) => {
    quote.project_connection.customer_connections.forEach((cc) => {
      const userId = cc.customer.user_id;
      if (cc.customer.user.is_active === true) {
        if (!expiredQuotesGroupByUserId[userId]) {
          expiredQuotesGroupByUserId[userId] = { quotes: [], userData: cc.customer.user };
        }
        expiredQuotesGroupByUserId[userId].quotes.unshift(quote)
      }
    })
  });

  const toSendQuoteExpiredEmailData: CreateSendUserExpiredQuoteNoticeEmailJobParam[] = Object.entries(expiredQuotesGroupByUserId).map(([_, data]) => {
    const { quotes, userData } = data;
    return {
      receiverEmail: userData.email,
      receiverName: `${userData.first_name} ${userData.last_name}`,
      quotes: quotes.map((q) => ({
        short_id: q.short_id,
        project_request_title: q.project_connection.project_request.title,
        vendor_full_name: q.project_connection.vendor_company.name,
      })),
    }
  });

  const expiredQuoteTasks = toSendQuoteExpiredEmailData.map((d) => {
    return createSendUserExpiredQuoteNoticeEmailJob(d);
  });

  const expiredQuoteNotificationJobData = Object.entries(expiredQuotesGroupByUserId).reduce<NotificationJob['data']>((acc, [_, data]) => {
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
  const notificationTask = createNotificationQueueJob({ data: expiredQuoteNotificationJobData });

  await Promise.all([...expiredQuoteTasks, notificationTask]);

  process.exit(0);
}

main();
