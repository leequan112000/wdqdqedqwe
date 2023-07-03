import moment from 'moment';
import { prisma } from '../connectDB';
import { createSendUserExpiredQuoteNoticeEmailJob, createSendUserExpiringQuoteNoticeEmailJob } from '../queues/email.queues';
import { CreateSendUserExpiredQuoteNoticeEmailJobParam, CreateSendUserExpiringQuoteNoticeEmailJobParam } from '../queues/types';
import { QuoteStatus } from '../helper/constant';

const EXPIRING_DAYS = 3;

async function startCheckingExpiringAndExpiredQuote() {
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

  const expiredQuotesEmailQuoteData = expiredQuotes.map((q) => {
    return {
      id: q.id,
      short_id: q.short_id,
      project_request_title: q.project_connection.project_request.title,
      vendor_full_name: q.project_connection.vendor_company.name,
    };
  });

  const toSendQuoteExpiredEmailData: CreateSendUserExpiredQuoteNoticeEmailJobParam[] = [];

  expiredQuotes.forEach((q) => {
    q.project_connection.customer_connections.forEach((cc) => {
      if (!toSendQuoteExpiredEmailData.find((d) => d.receiverEmail === cc.customer.user.email)) {
        toSendQuoteExpiredEmailData.push({
          receiverId: cc.customer.user_id,
          receiverEmail: cc.customer.user.email,
          receiverName: `${cc.customer.user.first_name} ${cc.customer.user.last_name}`,
          projectConnectionId: q.project_connection_id,
          projectRequestTitle: q.project_connection.project_request.title,
          quotes: expiredQuotesEmailQuoteData,
        });
      }
    });
  });
  const expiredQuoteTasks = toSendQuoteExpiredEmailData.map((d) => {
    return createSendUserExpiredQuoteNoticeEmailJob(d);
  });


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

  const toSendQuoteExpiringEmailData: CreateSendUserExpiringQuoteNoticeEmailJobParam[] = [];

  const expiringQuotesEmailQuoteData = expiringQuotes.map((q) => {
    return {
      id: q.id,
      short_id: q.short_id,
      project_request_title: q.project_connection.project_request.title,
      vendor_full_name: q.project_connection.vendor_company.name,
    };
  });

  expiringQuotes.forEach((q) => {
    q.project_connection.customer_connections.forEach((cc) => {
      if (!toSendQuoteExpiringEmailData.find((d) => d.receiverEmail === cc.customer.user.email)) {
        toSendQuoteExpiringEmailData.push({
          receiverId: cc.customer.user_id,
          receiverEmail: cc.customer.user.email,
          receiverName: `${cc.customer.user.first_name} ${cc.customer.user.last_name}`,
          projectConnectionId: q.project_connection_id,
          projectRequestTitle: q.project_connection.project_request.title,
          quotes: expiringQuotesEmailQuoteData,
          expiringIn: `${EXPIRING_DAYS} days`
        });
      }
    });
  });
  const expiringQuoteTasks = toSendQuoteExpiringEmailData.map((d) => {
    return createSendUserExpiringQuoteNoticeEmailJob(d);
  });

  await Promise.all([...expiredQuoteTasks, ...expiringQuoteTasks]);

  process.exit(0);
}

startCheckingExpiringAndExpiredQuote();
