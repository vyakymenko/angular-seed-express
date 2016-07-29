
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';
import * as routes from './routes';

var _proddir = "../client";
var app = express();

export = function (port: number, mode: string) {

  app.use(bodyParser.json());
  app.use(compression());

  /**
   * Dev Mode.
   * @note Dev server will only give for you middleware.
   */
  if (mode == 'dev'){
    app.all('/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });

    /**
     * Api Routes for `Development`.
     */
    routes.init(app);
  }
  else {
    /**
     * Prod Mode.
     * @note Prod mod will give you static + middleware.
     */

    /**
     * Api Routes for `Production`.
     */
    routes.init(app);

    /**
     * Static.
     */
    app.use('/client/js', express.static(path.resolve(__dirname, _proddir + '/js')));
    app.use('/client/css', express.static(path.resolve(__dirname, _proddir + '/css')));
    app.use('/client/assets', express.static(path.resolve(__dirname, _proddir + '/assets')));

    /**
     * Spa Res Sender.
     * @param req {any}
     * @param res {any}
     */
    var renderIndex = function(req: express.Request, res: express.Response) {
      res.sendFile(path.resolve(__dirname, _proddir+'/index.html'));
    };

    /**
     * Prevent server routing and use @ng2-router.
     */
    app.get('/*', renderIndex);
  }

  /**
   * Server with gzip compression.
   */
  var server = app.listen(port, function() {
    var port = server.address().port;
    console.log('App is listening on port:' + port);
  });

};
