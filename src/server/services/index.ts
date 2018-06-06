import * as express from 'express';
import { nameList } from './name.list';

export function init(app: express.Application) {
  nameList(app);
}
