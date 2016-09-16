import * as gulp from 'gulp';
import { join } from 'path';

import Config from '../../config';

/**
 * Executes the build task, copying all TypeScript files over to the `dist/tmp` directory.
 */
export = () => {
  return gulp.src([
      join(Config.APP_SERVER_SRC, '**/*.*'),
      '!' + join(Config.APP_SERVER_SRC, '**/*.ts'),
      '!' + join(Config.APP_SERVER_SRC, 'tsconfig.json')
    ])
    .pipe(gulp.dest(Config.APP_SERVER_DEST));
};
