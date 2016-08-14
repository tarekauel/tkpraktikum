var logger = require('winston');

module.exports = function(app, ds, callback) {
  var conferences = [],
    author = {
      username: 'author',
      password: 'tk',
      email: 'author1@chair.de',
      emailVerified: true
    },
    chairs = [
      {
        username: 'chairman1',
        password: 'tk',
        email: 'chairmen1@chair.de',
        emailVerified: true
      },
      {
        username: 'chairman2',
        password: 'tk',
        email: 'chairman2@chair.de',
        emailVerified: true
      }
    ];

  app.models.conference.find({}, function (err, results) {
    results.map(function (conference, idx) {
      chairs[idx].defaultConferenceId = conference.id;
      author.defaultConferenceId = conference.id;
    });

    conferences = results;
  });

  app.models.user.create(author, function (err, model) {
    if (err) return callback(err);
    author.id = model.id;
    model.updateAttribute('defaultConferenceId', author.defaultConferenceId);
    logger.info('Author created');
  });

  app.models.user.create(chairs, function(err, users) {
    if(err) return callback(err);

    users.map(function(u, idx) {
      u.updateAttribute('defaultConferenceId', chairs[idx].defaultConferenceId);

      app.models.attendance.create({
        conferenceId: conferences[idx].id,
        attendeeId: u.id
      }, function (err, model) {
        if (!err) logger.info('Assigned attendee to conference:', u.username, conferences[idx].name);
      });

      app.models.attendance.create({
        conferenceId: conferences[idx].id,
        attendeeId: author.id
      }, function (err, model) {
        if (!err) logger.info('Assigned attendee to that conference:', author.username);
      });

      app.models.chairman.create({
        conferenceId: conferences[idx].id,
        chairId: u.id
      }, function (err, model) {
        if (!err) logger.info('Assigned chairman to that conference:', u.username);
      });

      app.models.author.create({
        conferenceId: conferences[idx].id,
        authorId: author.id
      }, function (err, model) {
        if (!err) logger.info('Assiged author to that conference:', author.username);
      });
    });

    logger.info('Created chairmans');
    callback(err);
  });
};
