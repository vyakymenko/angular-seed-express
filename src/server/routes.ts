import * as express from 'express';
import * as services from './services/index'

export function init(app: express.Application) {
  services.init(app);
}
