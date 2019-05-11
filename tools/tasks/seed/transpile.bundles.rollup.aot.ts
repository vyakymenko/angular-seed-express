import * as gulp from 'gulp';
import * as sourcemaps from 'gulp-sourcemaps';
import * as template from 'gulp-template';
import * as rename from 'gulp-rename';
import { join } from 'path';
import * as through2 from 'through2';

import Config from '../../config';
import { makeTsProject } from '../../utils';
import { TemplateLocalsBuilder } from '../../utils/seed/template_locals';

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */
export = () => {
  const tsProject = makeTsProject(
    {
      allowJs: true,
      declaration: false,
      noFallthroughCasesInSwitch: false
    },
    Config.TMP_DIR
  );
  const src = [join(Config.TMP_DIR, 'bundle.js')];
  const result = gulp
    .src(src)
    .pipe(
      Config.PRESERVE_SOURCE_MAPS ? sourcemaps.init({ loadMaps: true, largeFile: true }) : through2.obj()
    )
    .pipe(tsProject())
    .once('error', function(e: any) {
      this.once('finish', () => process.exit(1));
    });

  return result.js
    .pipe(Config.PRESERVE_SOURCE_MAPS ? sourcemaps.write() : through2.obj())
    .pipe(template(new TemplateLocalsBuilder().build(), Config.TEMPLATE_CONFIG))
    .pipe(rename(Config.JS_PROD_APP_BUNDLE))
    .pipe(gulp.dest(Config.JS_DEST))
    .on('error', (e: any) => {
      console.log(e);
    });
};
