var _ = require('underscore');
var logger = require('winston');

module.exports = function(app, ds, callback) {
  var tags = [
    {
      'name': 'computer-science'
    },
    {
      'name': 'network'
    },
    {
      'name': 'security'
    },
    {
      'name': 'machine-learning'
    },
    {
      'name': 'big-data'
    },
    {
      'name': 'testing'
    },
    {
      'name': 'software-engineering'
    },
    {
      'name': 'software-architecture'
    }
  ];

  app.models.Tag.create(tags, function(err) {
    if (!err) {
      logger.info('Created tags');
    }
    callback(err);
  });
};
