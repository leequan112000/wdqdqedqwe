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

export const slackNotification = {
  singleTextNotification,
  newShortlistNotification,
};
