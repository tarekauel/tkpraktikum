var logger = require('winston');

module.exports = function(app, ds, callback) {
  var conferences = [
    {
      name: 'TK Conference',
      sharedSecret: 'tk'
    },
    {
      name: 'Other conference',
      sharedSecret: 'something'
    }
  ];

  app.models.Conference.create(conferences, function(err) {
    if (!err) {
      logger.info('Created conferences');
    }

    callback(err);
  });
};
