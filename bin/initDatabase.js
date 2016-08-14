var path = require('path');
var async = require('async');
var logger = require('./../server/logger');
var fs = require('fs');

try {
  fs.unlinkSync(process.env.DB_FILE || './db.json');
  logger.info("removed db.json");
} catch(err) {
  logger.info("db.json does not exists");
}

var createTags = require('./createTags.js');
var createConferences = require('./createConferences.js');
var createAffiliations = require('./createAffiliations.js');
var createUser = require('./createUser.js');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.Postgres;

ds.automigrate(undefined, function(err) {
  if (err) throw err;
  logger.info('created database schema');

  var createFunctions = [createTags, createAffiliations, createConferences, createUser];

  createFunctions = createFunctions.map(function(fn) {
    return function(callback) {
      fn(app, ds, callback);
    };
  });

  async.series(createFunctions, function(err) {
    if (err) throw err;
  })
});
