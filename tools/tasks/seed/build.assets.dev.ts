import * as gulp from 'gulp';
import { join } from 'path';

import { APP_CLIENT_DEST, APP_CLIENT_SRC, TEMP_FILES } from '../../config';

/**
 * Executes the build process, copying the assets located in `src/client` over to the appropriate
 * `dist/dev` directory.
 */
export = () => {
  let paths: string[] = [
    join(APP_CLIENT_SRC, '**'),
    '!' + join(APP_CLIENT_SRC, '**', '*.ts'),
    '!' + join(APP_CLIENT_SRC, '**', '*.scss')
  ].concat(TEMP_FILES.map((p) => { return '!' + p; }));

  return gulp.src(paths)
    .pipe(gulp.dest(APP_CLIENT_DEST));
};
