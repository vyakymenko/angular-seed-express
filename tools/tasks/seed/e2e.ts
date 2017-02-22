import * as gulp from 'gulp';
import { resolve, join } from 'path';
import { protractor } from 'gulp-protractor';
import Config from '../../config';

class Protractor {
  server(port: number) {
    return require('../../../dist/server/prod').init(port, 'prod');
  }
}

/**
 * Executes the build process, running all e2e specs using `protractor`.
 */
export = (done: any) => {
  process.env.LANG = 'en_US.UTF-8';
  new Protractor()
    .server(9000)
    .then((server: any) => {
      gulp
        .src(join(Config.DEV_DEST, '**/*.e2e-spec.js'))
        .pipe(protractor({ configFile: 'protractor.conf.js' }))
        .on('error', (error: string) => { throw error; })
        .on('end', () => { server.close(done); });
    });
};
