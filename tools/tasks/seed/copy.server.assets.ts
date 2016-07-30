import * as gulp from 'gulp';
import { join } from 'path';

import { APP_SERVER_SRC, APP_SERVER_DEST } from '../../config';

/**
 * Executes the build task, copying all TypeScript files over to the `dist/tmp` directory.
 */
export = () => {
  return gulp.src([
      join(APP_SERVER_SRC, '**/*.*'),
      '!' + join(APP_SERVER_SRC, '**/*.ts'),
      '!' + join(APP_SERVER_SRC, 'tsconfig.json')
    ])
    .pipe(gulp.dest(APP_SERVER_DEST));
};
