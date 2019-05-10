import * as gulp from 'gulp';
import * as cached from 'gulp-cached';
import * as merge from 'merge-stream';
import { join/*, sep, relative*/ } from 'path';

import Config from '../../config';
import { makeTsProject, TemplateLocalsBuilder } from '../../utils';
import { TypeScriptTask } from '../typescript_task';

let typedBuildCounter = Config.TYPED_COMPILE_INTERVAL; // Always start with the typed build.

/**
 * Executes the build process, transpiling the TypeScript files (except the spec and e2e-spec files) for the development
 * environment.
 */
export =
  class BuildServerDev extends TypeScriptTask {
    run() {
      let tsProject: any;
      const typings = gulp.src([
        Config.TOOLS_DIR + '/manual_typings/**/*.d.ts'
      ]);
      const src = [
        join(Config.APP_SERVER_SRC, '**/*.ts')
      ];

      let projectFiles = gulp.src(src);
      let result: any;
      let isFullCompile = true;

      // Only do a typed build every X builds, otherwise do a typeless build to speed things up
      if (typedBuildCounter < Config.TYPED_COMPILE_INTERVAL) {
        isFullCompile = false;
        tsProject = makeTsProject({isolatedModules: true});
        projectFiles = projectFiles.pipe(cached());
      } else {
        tsProject = makeTsProject();
        projectFiles = merge(typings, projectFiles);
      }

      result = projectFiles
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(tsProject())
        .on('error', () => {
          typedBuildCounter = Config.TYPED_COMPILE_INTERVAL;
        });

      if (isFullCompile) {
        typedBuildCounter = 0;
      } else {
        typedBuildCounter++;
      }

      return result.js
        .pipe(plugins.sourcemaps.write())
        // Use for debugging with Webstorm/IntelliJ
        // https://github.com/mgechev/angular2-seed/issues/1220
        //    .pipe(plugins.sourcemaps.write('.', {
        //      includeContent: false,
        //      sourceRoot: (file: any) =>
        //        relative(file.path, PROJECT_ROOT + '/' + APP_SRC).replace(sep, '/') + '/' + APP_SRC
        //    }))
        .pipe(plugins.template(new TemplateLocalsBuilder().withStringifiedSystemConfigDev().build()))
        .pipe(gulp.dest(Config.APP_SERVER_DEST));
    }
  };
