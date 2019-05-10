import * as gulp from 'gulp';

import { watchAppFiles } from '../../utils';

gulp.task('watch.while_testing', function () {
  watchAppFiles('**/!(*.ts)', (e: any, done: any) =>
    gulp.series(['build.assets.dev', 'build.html_css', 'build.index.dev', done]));
  watchAppFiles('**/(*.ts)', (e: any, done: any) =>
    gulp.series(['build.js.dev', 'build.index.dev', () => {
      gulp.series(['build.js.test', 'karma.run.without_coverage', done]);
    }]));
});

export = (done: any) => {
  gulp.series(['build.test',
    'watch.while_testing',
    'karma.run.without_coverage']);
};
