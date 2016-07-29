import * as gulp from 'gulp';

import { APP_CLIENT_DEST } from '../../config';

/**
 * Executes the build process, generating the manifest file using `angular2-service-worker`.
 */
export = () => {
  return require('angular2-service-worker')
    .gulpGenManifest({
      group: [{
        name: 'css',
        sources: gulp.src(`${APP_CLIENT_DEST}/**/*.css`)
      }, {
        name: 'js',
        sources: gulp.src(`${APP_CLIENT_DEST}/**/*.js`)
      }]
    })
    .pipe(gulp.dest(APP_CLIENT_DEST));
};
