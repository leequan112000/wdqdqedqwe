import Queue from 'bull';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});
const subscriber = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

export function createQueue<T = any>(name: string) {
  return new Queue<T>(name, {
    redis: {},
    createClient: (type, redisOpts = {}) => {
      switch (type) {
        case 'client':
          return redisClient;
        case 'subscriber':
          return subscriber;
        case "bclient":
          return new Redis(process.env.REDIS_URL!, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false
          });
        default:
          throw new Error("Unexpected connection type: " + type);
      }
    }
  });
}

export type BulkEmailJobData<T> = {
  emailData: T,
  receiverEmail: string;
}[]

export function createBulkEmailJobData<T = { [x: string]: any }>(
  data: BulkEmailJobData<T>,
  templateId: string
) {
  return data.map((d) => ({ emailData: d.emailData, templateId, receiverEmail: d.receiverEmail }))
}
