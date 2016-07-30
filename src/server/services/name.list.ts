import * as express from 'express';
import * as redis from 'redis';

// For static data
let nameData = require('../data/name.list.json');

export function nameList(app: express.Application) {

  /**
   * Get name list.
   * @static
   */
  app.get('/api/name-list/static',
    (req:any, res:any, next:any) => {

      res.json(nameData);
    });

  /**
   * Get name list.
   * @database
   */
  app.get('/api/name-list',
    (req:any, res:any, next:any) => {

      let RedisClient = redis.createClient(),
          nameList = [];

      RedisClient.smembers('name-list',
        (err:any, replies:any) => {
          nameList = replies;
          res.json(nameList);
      });

      RedisClient.quit();
    });

  /**
   * Add new name.
   * @database
   */
  app.post('/api/name-list',
    (req:any, res:any, next:any) => {

      let RedisClient = redis.createClient(),
          user = JSON.parse(req.body);

      RedisClient.sadd('name-list', user.name,
        (err:any, replies:any) => {

          res.json({success: true});
        });

      RedisClient.quit();
    });

  /**
   * Delete name.
   * @database
   */
  app.delete('/api/name-list',
    (req:any, res:any, next:any) => {

      let RedisClient = redis.createClient(),
          user = JSON.parse(req.body);

      RedisClient.srem('name-list', user.name,
        (err:any, replies:any) => {

          res.json({success: true});
        });

      RedisClient.quit();
    });

}
