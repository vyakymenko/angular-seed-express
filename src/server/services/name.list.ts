import * as express from 'express';
import * as redis from 'redis';

const nameData = require('../data/name.list.json');

export function nameList(app: express.Application) {

  /**
   * Get name list.
   * @static
   */
  app.get('/api/name-list/static',
    (req: express.Request, res: express.Response,
     next: express.NextFunction) => {

      res.json(nameData);
    });

  /**
   * Get name list.
   * @database
   */
  app.get('/api/name-list',
    (req: express.Request, res: express.Response,
     next: express.NextFunction) => {

      const RedisClient = redis.createClient();

      let nameList: string[] = [];

      RedisClient.smembers('name-list',
        (err: any, replies: any) => {
          console.log(`
          Reply length: ${replies.length}.
          Reply: ${replies}.`);
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
    (req: express.Request, res: express.Response,
     next: express.NextFunction) => {

      const RedisClient = redis.createClient(),
            request = req.body;
            // request = JSON.parse(req.body);

      RedisClient.sadd('name-list', request.name,
        (err: any, replies: any) => {
          console.log(`
          Reply: ${replies}.`);

          res.json({success: true});
        });

      RedisClient.quit();
    });

  /**
   * Delete name.
   * @database
   */
  app.delete('/api/name-list',
    (req: express.Request, res: express.Response,
     next: express.NextFunction) => {

      const RedisClient = redis.createClient(),
            request = req.body;
            // request = JSON.parse(req.body);

      RedisClient.srem('name-list', request.name,
        (err: any, replies: any) => {
          console.log(`
          Reply length: ${replies.length}.
          Reply: ${replies}.`);

          res.json({success: true});
        });

      RedisClient.quit();
    });

}
