import * as gulp from 'gulp';
import { protractor } from 'gulp-protractor';

class Protractor {
  server(port: number) {
      return require('../../../dist/dev/server').init(port, 'dev');
  }
}

/**
 * Executes the build process, running all e2e specs using `protractor`.
 */
export = (done: any) => {
  new Protractor()
    .server(9001)
    .then((server: any) => {
      gulp
        .src('./dist/dev/**/*.e2e-spec.js')
        .pipe(protractor({ configFile: 'protractor.conf.js' }))
        .on('error', (error: string) => { throw error; })
        .on('end', () => { server.close(done); });
    });
};
