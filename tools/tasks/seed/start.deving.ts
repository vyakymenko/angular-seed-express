import * as gulp from 'gulp';

import { notifyLiveReload, watchAppFiles } from '../../utils';

gulp.task('watch.while_deving', function () {
  watchAppFiles('**/!(*.ts)', (e: any, done: any) =>
    gulp.series(['build.assets.dev', 'build.html_css', 'build.index.dev', () => { notifyLiveReload(e); done(); }]));
  watchAppFiles('**/(*.ts)', (e: any, done: any) =>
    gulp.series(['build.js.dev', 'build.index.dev', () => {
      notifyLiveReload(e);
      gulp.series(['build.js.test', 'karma.run.with_coverage']);
    }]));
});

export = (done: any) => {
  gulp.series(['build.test',
    'watch.while_deving',
    'server.start',
    'karma.run.with_coverage',
    'serve.coverage.watch']);
};
