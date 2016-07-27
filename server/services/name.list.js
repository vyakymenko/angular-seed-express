var namesData = require('../data/name.list.json');

module.exports = function(app) {

  app.get('/api/name-list', function (req, res, next) {
    res.json(namesData);
  });
};
