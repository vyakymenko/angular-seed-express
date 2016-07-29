import { DEV_CLIENT_DEST, DEV_SERVER_DEST } from '../../config';
import { clean } from '../../utils';

/**
 * Executes the build process, cleaning all files within the `/dist/dev` directory.
 */
export = clean([DEV_CLIENT_DEST, DEV_SERVER_DEST]);
