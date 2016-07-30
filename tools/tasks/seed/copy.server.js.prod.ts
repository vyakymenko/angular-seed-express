import * as gulp from 'gulp';
import { join } from 'path';

import { APP_SERVER_SRC, TMP_SERVER_DIR } from '../../config';

/**
 * Executes the build task, copying all TypeScript files over to the `dist/tmp` directory.
 */
export = () => {
  return gulp.src([
      join(APP_SERVER_SRC, '**/*.ts'),
      '!' + join(APP_SERVER_SRC, '**/*.spec.ts'),
      '!' + join(APP_SERVER_SRC, '**/*.e2e-spec.ts')
    ])
    .pipe(gulp.dest(TMP_SERVER_DIR));
};
