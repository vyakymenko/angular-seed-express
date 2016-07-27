var
  express = require('express'),
  path = require('path'),
  compression = require('compression');

var port = 9000,
    _proddir = '../dist/prod';
    app = express();

var ServerInit = function () {

  app.use(compression());

  /**
   * Api Routes.
   */
  require('./routes')(app);


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

  /**
   * Server with gzip compression.
   */
  var server = app.listen(port, function() {
    var port = server.address().port;
    console.log('App is listening on port:' + port);
  });

};

module.exports = ServerInit;
