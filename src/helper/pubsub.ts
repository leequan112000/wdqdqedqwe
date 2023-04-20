import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export const pubsub = new RedisPubSub({
  publisher: new Redis(process.env.REDIS_URL!),
  subscriber: new Redis(process.env.REDIS_URL!),
});
