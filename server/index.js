var
  express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  compression = require('compression');

var _proddir = '../dist/prod';
    app = express();

module.exports = function (port, mode) {

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
  }
  else {
    /**
     * Prod Mode.
     * @note Prod mod will give you static + middleware.
     */

    /**
     * Static.
     */
    app.use('/js', express.static(path.resolve(__dirname, _proddir+'/js')));
    app.use('/css', express.static(path.resolve(__dirname, _proddir+'/css')));
    app.use('/assets', express.static(path.resolve(__dirname, _proddir+'/assets')));

    /**
     * Spa Res Sender.
     * @param req {any}
     * @param res {any}
     */
    var renderIndex = function(req, res) {
      res.sendFile(path.resolve(__dirname, _proddir+'/index.html'));
    };

    /**
     * Prevent server routing and use @ng2-router.
     */
    app.get('/*', renderIndex);
  }

  /**
   * Api Routes.
   */
  require('./routes')(app);

  /**
   * Server with gzip compression.
   */
  var server = app.listen(port, function() {
    var port = server.address().port;
    console.log('App is listening on port:' + port);
  });

};
