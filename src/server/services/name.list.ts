import * as express from 'express';

var namesData = require('../data/name.list.json');

export function nameList(app: express.Application) {
  app.get('/api/name-list', function (req, res, next) {
    res.json(namesData);
  });
};