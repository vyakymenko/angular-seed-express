var
  express = require('express'),
  path = require('path'),
  compression = require('compression');

var port = 9000,
  app = express();

app.use(compression());

/**
 * Api Routes.
 */



/**
 * Static.
 */
app.use('/js', express.static(path.resolve(__dirname, 'dist/prod/js')));
app.use('/css', express.static(path.resolve(__dirname, 'dist/prod/css')));
app.use('/assets', express.static(path.resolve(__dirname, 'dist/prod/assets')));

/**
 * Spa Res Sender.
 * @param req
 * @param res
 */
var renderIndex = function(req, res) {
  res.sendFile(path.resolve(__dirname, 'dist/prod/index.html'));
};

/**
 * Prevent server routing and use @ng2-router.
 */
app.get('/*', renderIndex);

/**
 * Server with gzip compression.
 * @type {http.Server}
 */
var server = app.listen(port, function() {
  var port = server.address().port;
  console.log('App is listening on port:' + port);
});
