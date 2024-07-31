import { CronJob } from 'cron';
import moment from 'moment-timezone';

import { prismaCRODb } from '../prisma';
import { VendorSurveyStatus } from '../helper/constant';
import { app_env } from '../environment';
import { vendorSurveyReminderEmail } from '../mailer/vendorSurvey';
import Sentry from '../sentry';

export const vendorSurveyReminderJob = new CronJob(
  '0 0 9-17 * * *', // At minute 0 past every hour from 9 through 17.
  async function () {
    const oneHourAgo = moment().subtract(1, 'hour').toDate();
    const surveys = await prismaCRODb.vendorSurvey.findMany({
      where: {
        status: VendorSurveyStatus.INCOMPLETE,
        updated_at: {
          lt: oneHourAgo,
        },
        reminder_counts: 0,
        email: {
          not: null,
        },
      },
    });

    const reminderTasks = surveys.map(async (s) => {
      try {
        await prismaCRODb.vendorSurvey.update({
          where: {
            id: s.id,
          },
          data: {
            reminder_counts: {
              increment: 1,
            },
          },
        });

        const buttonUrl = s.vendor_company_id
          ? `${app_env.APP_URL}/vendor-survey/${s.vendor_company_id}`
          : `${app_env.APP_URL}/vendor-survey?sid=${s.id}`;
        await vendorSurveyReminderEmail(
          {
            button_url: buttonUrl,
          },
          s.email!,
        );
      } catch (error) {
        Sentry.captureException(error);
      }
    });

    await Promise.all(reminderTasks);
  },
  null,
  false,
  'America/Los_Angeles',
);
