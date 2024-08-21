import { WebClient } from '@slack/web-api';
import {
  type Block,
  type KnownBlock,
} from '@slack/types/dist/block-kit/blocks';
import Sentry from '../sentry';
import { env } from '../env';

const web = new WebClient(env.CROMATIC_NOTIFY_SLACK_OAUTH_TOKEN);

function messagePrefix(message: string) {
  if (env.APP_ENV !== 'production') {
    return `[${env.APP_ENV}] ${message}`;
  }

  return message;
}

type SendCromaticNotifyMessageParam = {
  blocks: (KnownBlock | Block)[];
};

async function sendCromaticNotifyMessage(
  param: SendCromaticNotifyMessageParam,
) {
  try {
    const channel = env.CROMATIC_NOTIFY_SLACK_CHANNEL_ID;

    // Making sure the bot is in the channel.
    await web.conversations.join({
      channel: channel,
    });

    await web.chat.postMessage({
      blocks: param.blocks,
      channel,
    });
  } catch (error) {
    Sentry.captureException(error);
  }
}

async function singleTextNotification(message: string) {
  await sendCromaticNotifyMessage({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: messagePrefix(message),
        },
      },
    ],
  });
}

type NewShortlistNotificationParam = {
  submittedAt: string;
  submittedBy: string;
  shortlistCounts: string;
  shortlistedVendors: Array<{ vendor_id: string; vendor_name: string }>;
  buttonUrl: string;
};

async function newShortlistNotification(param: NewShortlistNotificationParam) {
  await sendCromaticNotifyMessage({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: messagePrefix(
            'There is a new shortlist submission!\nHere is the details:',
          ),
        },
        fields: [
          {
            type: 'mrkdwn',
            text: '*Submitted by*',
          },
          {
            type: 'mrkdwn',
            text: '*Submitted at*',
          },
          {
            type: 'plain_text',
            text: param.submittedBy,
          },
          {
            type: 'plain_text',
            text: param.submittedAt,
          },
          {
            type: 'mrkdwn',
            text: '*Shortlist counts*',
          },
          {
            type: 'plain_text',
            text: ' ',
          },
          {
            type: 'plain_text',
            text: param.shortlistCounts,
          },
        ],
      },
      {
        type: 'divider',
      },
      ...param.shortlistedVendors.map((v) => ({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${v.vendor_name}*\n${v.vendor_id}`,
        },
      })),
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Click to view more details on Retool',
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View Request',
            emoji: true,
          },
          url: param.buttonUrl,
          action_id: 'view-request',
        },
      },
    ],
  });
}

type GlobalPasswordLoginNotificationParam = {
  email: string;
  ipAddress: string;
  dateTime: string;
  timezone: string;
  city: string;
  region: string;
  country: string;
};

async function globalPasswordLoginNotification(
  param: GlobalPasswordLoginNotificationParam,
) {
  await sendCromaticNotifyMessage({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: messagePrefix('Login attempt using global password!'),
        },
        fields: [
          {
            type: 'mrkdwn',
            text: '*Email*',
          },
          {
            type: 'mrkdwn',
            text: '*IP Address*',
          },
          {
            type: 'mrkdwn',
            text: param.email,
          },
          {
            type: 'mrkdwn',
            text: param.ipAddress,
          },
          {
            type: 'mrkdwn',
            text: '*Date & Time*',
          },
          {
            type: 'mrkdwn',
            text: '*Timezone*',
          },
          {
            type: 'mrkdwn',
            text: param.dateTime,
          },
          {
            type: 'mrkdwn',
            text: param.timezone,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Location Info*',
        },
        fields: [
          {
            type: 'mrkdwn',
            text: '*City*',
          },
          {
            type: 'mrkdwn',
            text: '*Region*',
          },
          {
            type: 'mrkdwn',
            text: param.city,
          },
          {
            type: 'mrkdwn',
            text: param.region,
          },
          {
            type: 'mrkdwn',
            text: '*Country*',
          },
          {
            type: 'mrkdwn',
            text: ' ',
          },
          {
            type: 'mrkdwn',
            text: param.country,
          },
          {
            type: 'mrkdwn',
            text: ' ',
          },
        ],
      },
    ],
  });
}

type ContactUsNotificationParam = {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companyType: string;
  remark?: string | null;
};

async function contactUsNotification(param: ContactUsNotificationParam) {
  await sendCromaticNotifyMessage({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: messagePrefix('We have a new contact us ticket:'),
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*First name:*\n${param.firstName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Last name:*\n${param.lastName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${param.email}`,
          },
          {
            type: 'mrkdwn',
            text: `*Company name:*\n${param.companyName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Company type:*\n${param.companyType}`,
          },
          {
            type: 'mrkdwn',
            text: `*Remark:*\n${param.remark || '-'}`,
          },
        ],
      },
    ],
  });
}

export const slackNotification = {
  singleTextNotification,
  newShortlistNotification,
  globalPasswordLoginNotification,
  contactUsNotification,
};
