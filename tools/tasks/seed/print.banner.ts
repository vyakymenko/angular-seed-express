import Config from '../../config';
import { readFile } from 'fs';
import * as util from 'gulp-util';
import { join } from 'path';

export = (done: any) => {
  let bannerPath = join(Config.TOOLS_DIR, 'config', 'banner.txt');
  readFile(bannerPath, (e, content) => {
    if (!e) {
      console.log(util.colors.green(content.toString()));
    }
    done();
  });
};

