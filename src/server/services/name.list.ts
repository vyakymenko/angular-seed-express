import * as express from 'express';

import { RedisClient } from '../db/redis';


var namesData = require('../data/name.list.json');

export function nameList(app: express.Application) {

  app.get('/api/name-list', function (req, res, next) {

    RedisClient.smembers('name-list:name');

    RedisClient.quit();

    res.json(namesData);
  });

}
