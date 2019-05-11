import * as gulp from 'gulp';
import * as sourcemaps from 'gulp-sourcemaps';
import * as uglify from 'gulp-uglify';
import * as merge from 'merge-stream';
import * as through2 from 'through2';
import { join } from 'path';

import Config from '../../config';

const getTask = (target: string, destDir: string, sourceMaps: boolean = false) => {
  return gulp
    .src(join(destDir, target))
    .pipe(
      sourceMaps && Config.PRESERVE_SOURCE_MAPS
        ? sourcemaps.init({
            loadMaps: true,
            largeFile: true
          })
        : through2.obj()
    )
    .pipe(
      uglify({
        compress: true,
        mangle: true
      })
    )
    .pipe(sourceMaps && Config.PRESERVE_SOURCE_MAPS ? sourcemaps.write('.') : through2.obj())
    .pipe(gulp.dest(destDir));
};

export = () => {
  return merge(
    getTask(Config.JS_PROD_APP_BUNDLE, Config.JS_DEST, true),
    getTask(Config.JS_PROD_SHIMS_BUNDLE, Config.JS_DEST)
  );
};
