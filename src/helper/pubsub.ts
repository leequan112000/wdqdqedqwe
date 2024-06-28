import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { Notification } from '@prisma/client';

export const pubsub = new RedisPubSub({
  publisher: new Redis(process.env.REDIS_URL!),
  subscriber: new Redis(process.env.REDIS_URL!),
});

export const publishNewNotification = (newNotification: Notification) => {
  return pubsub.publish('NEW_NOTIFICATION', { newNotification });
};
