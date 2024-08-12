import { WebClient } from '@slack/web-api';
import Sentry from '../sentry';
import { env } from '../env';

const web = new WebClient(env.CROMATIC_NOTIFY_SLACK_OAUTH_TOKEN);

function messagePrefix(message: string) {
  if (env.APP_ENV !== 'production') {
    return `[${env.APP_ENV}] ${message}`;
  }

  return message;
}

async function sendCromaticNotifyMessage(message: string) {
  try {
    const channel = env.CROMATIC_NOTIFY_SLACK_CHANNEL_ID;

    // Making sure the bot is in the channel.
    await web.conversations.join({
      channel: channel,
    });

    await web.chat.postMessage({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: messagePrefix(message),
          },
        },
      ],
      channel,
    });
  } catch (error) {
    Sentry.captureException(error);
  }
}

export { sendCromaticNotifyMessage };
