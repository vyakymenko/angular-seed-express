import * as gulp from 'gulp';
import { join } from 'path';

import Config from '../../config';

/**
 * Executes the build process, linting the TypeScript files using `codelyzer`.
 */
export = () => {
  const src = [
    join(Config.APP_SRC, '**/*.ts'),
    '!' + join(Config.APP_SRC, '**/*.d.ts'),
      join(Config.E2E_SRC, '**/*.ts'),
    '!' + join(Config.E2E_SRC, '**/*.d.ts'),
    join(Config.TOOLS_DIR, '**/*.ts'),
    '!' + join(Config.TOOLS_DIR, '**/*.d.ts')
  ];

  return gulp.src(src, {'base': '.'})
    .pipe(plugins.tslint())
    .pipe(plugins.tslint.report({
      emitError: require('is-ci') || Config.FORCE_TSLINT_EMIT_ERROR
    }));
};
