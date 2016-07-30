import { PROD_CLIENT_DEST, PROD_SERVER_DEST, TMP_CLIENT_DIR } from '../../config';
import { clean } from '../../utils';

/**
 * Executes the build process, cleaning all files within the `/dist/dev` and `dist/tmp` directory.
 */
export = clean([PROD_CLIENT_DEST, PROD_SERVER_DEST, TMP_CLIENT_DIR]);
