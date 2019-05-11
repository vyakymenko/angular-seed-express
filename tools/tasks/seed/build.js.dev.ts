import * as log from 'fancy-log';
import * as gulp from 'gulp';
import * as sourcemaps from 'gulp-sourcemaps';
import * as merge from 'merge-stream';
import * as cached from 'gulp-cached';
import { join /*, sep, relative*/ } from 'path';

import Config from '../../config';
import { makeTsProject, TemplateLocalsBuilder } from '../../utils';
import { TypeScriptTask } from '../typescript_task';

let typedBuildCounter = Config.TYPED_COMPILE_INTERVAL; // Always start with the typed build.

/**
 * Executes the build process, transpiling the TypeScript files (except the spec and e2e-spec files) for the development
 * environment.
 */
export = class BuildJsDev extends TypeScriptTask {
  run() {
    let tsProject: any;
    const typings = gulp.src([Config.TOOLS_DIR + '/manual_typings/**/*.d.ts']);
    const src = [
      join(Config.APP_SRC, '**/*.ts'),
      '!' + join(Config.APP_SRC, '**/*.spec.ts'),
      '!' + join(Config.APP_SRC, '**/*.e2e-spec.ts'),
      '!' + join(Config.APP_SRC, `**/${Config.NG_FACTORY_FILE}.ts`)
    ];

    let projectFiles = gulp.src(src);
    let result: any;
    let isFullCompile = true;

    // Only do a typed build every X builds, otherwise do a typeless build to speed things up
    if (typedBuildCounter < Config.TYPED_COMPILE_INTERVAL) {
      isFullCompile = false;
      tsProject = makeTsProject({ isolatedModules: true });
      projectFiles = projectFiles.pipe(cached());
      log('Performing typeless TypeScript compile.');
    } else {
      tsProject = makeTsProject();
      projectFiles = merge(typings, projectFiles);
    }

    result = projectFiles
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      .on('error', () => {
        typedBuildCounter = Config.TYPED_COMPILE_INTERVAL;
      });

    if (isFullCompile) {
      typedBuildCounter = 0;
    } else {
      typedBuildCounter++;
    }

    return (
      result.js
        .pipe(sourcemaps.write())
        // Use for debugging with Webstorm/IntelliJ
        // https://github.com/mgechev/angular-seed/issues/1220
        //    .pipe(plugins.sourcemaps.write('.', {
        //      includeContent: false,
        //      sourceRoot: (file: any) =>
        //        relative(file.path, Config.PROJECT_ROOT + '/' + Config.APP_SRC).replace(sep, '/') + '/' + Config.APP_SRC
        //    }))
        .pipe(
          plugins.template(
            new TemplateLocalsBuilder()
              .withStringifiedSystemConfigDev()
              .build(),
            Config.TEMPLATE_CONFIG
          )
        )
        .pipe(gulp.dest(Config.APP_DEST))
    );
  }
};
