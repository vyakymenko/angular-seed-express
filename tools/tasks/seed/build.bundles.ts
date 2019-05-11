import * as gulp from 'gulp';
import * as concat from 'gulp-concat';
import * as replace from 'gulp-replace';
import * as merge from 'merge-stream';

import Config from '../../config';

/**
 * Executes the build process, bundling the shim files.
 */
export = () => merge(bundleShims());

/**
 * Returns the shim files to be injected.
 */
function getShims() {
  const libs = Config.DEPENDENCIES
    .filter(d => /\.js$/.test(d.src));

  return libs.filter(l => l.inject === 'shims')
    .concat(libs.filter(l => l.inject === 'libs'))
    .concat(libs.filter(l => l.inject === true))
    .map(l => l.src);
}

/**
 * Bundles the shim files.
 */
function bundleShims() {
  return gulp.src(getShims())
    .pipe(concat(Config.JS_PROD_SHIMS_BUNDLE))
    // Strip the first (global) 'use strict' added by reflect-metadata, but don't strip any others to avoid unintended scope leaks.
    .pipe(replace(/('|")use strict\1;var Reflect;/, 'var Reflect;'))
    .pipe(gulp.dest(Config.JS_DEST));
}
