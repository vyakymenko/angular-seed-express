var redis = require("redis"),
  client = redis.createClient();

client.sadd("names-list:name",
  "Edsger Dijkstra",
  "Donald Knuth",
  "Alan Turing",
  "Grace Hopper",
  redis.print);

client.quit();
