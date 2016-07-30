import * as redis from 'redis';

export const RedisClient = redis.createClient();

/**
 * Init Names List.
 */
RedisClient.sadd("names-list:name",
    "Edsger Dijkstra",
    "Donald Knuth",
    "Alan Turing",
    "Grace Hopper",
  redis.print);

RedisClient.quit();
