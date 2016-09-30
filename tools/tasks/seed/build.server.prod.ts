import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';
import { makeTsProject } from '../../utils';

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */

export = () => {
  let tsProject = makeTsProject();
  let src = [
    'typings/index.d.ts',
    Config.TOOLS_DIR + '/manual_typings/**/*.d.ts',
    join(Config.TMP_SERVER_DIR, '**/*.ts')
  ];
  let result = gulp.src(src)
    .pipe(plugins.plumber())
    .pipe(tsProject())
    .once('error', function () {
      this.once('finish', () => process.exit(1));
    });


  return result.js
    .pipe(gulp.dest(Config.APP_SERVER_DEST));
};
