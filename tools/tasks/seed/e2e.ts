import { spawn } from 'child_process';
import Config from '../../config';

const isWin = /^win/.test(process.platform);

class E2E {
  server(port: number) {
    return require('../../../dist/server/prod').init(port, 'prod');
  }
}

/**
 * Serves the application and runs e2e tests.
 */
export = (done: any) => {
  process.env.LANG = 'en_US.UTF-8';
  const cypress = isWin ? '.\\node_modules\\.bin\\cypress.cmd' : './node_modules/.bin/cypress';
  new E2E()
    .server(9000)
    .then((server: any) => {
      spawn(cypress, ['run', '--config', `baseUrl=${getBaseUrl()}`], {stdio: 'inherit'})
        .on('close', (code: number) => {
          server.close(done);
          process.exit(code);
        });
    });
};

function getBaseUrl() {
  return `http://localhost:9000${Config.APP_BASE}`;
}
