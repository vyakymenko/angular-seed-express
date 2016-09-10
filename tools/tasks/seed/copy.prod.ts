import * as gulp from 'gulp';
import { join } from 'path';

import { APP_CLIENT_SRC, TMP_CLIENT_DIR } from '../../config';

/**
 * Executes the build task, copying all TypeScript files over to the `dist/tmp` directory.
 */
export = () => {
  return gulp.src([
      join(APP_CLIENT_SRC, '**/*.ts'),
      join(APP_CLIENT_SRC, '**/*.html'),
      join(APP_CLIENT_SRC, '**/*.css'),
      join(APP_CLIENT_SRC, '**/*.json'),
      '!' + join(APP_CLIENT_SRC, '**/*.spec.ts'),
      '!' + join(APP_CLIENT_SRC, '**/*.e2e-spec.ts')
    ])
    .pipe(gulp.dest(TMP_CLIENT_DIR));
};
