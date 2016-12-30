import Config from '../../config';
import { clean } from '../../utils';

/**
 * Executes the build process, cleaning all files within the `/dist/dev` and `dist/tmp` directory.
 */
export = clean([Config.PROD_SERVER_DEST, Config.PROD_DEST, Config.TMP_DIR]);
