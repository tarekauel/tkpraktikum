module.exports = function(Conference) {
  Conference.validatesUniquenessOf('name');

  Conference.afterRemote('find', function(ctx, instances, next) {
    if (ctx.processed) {
      return next();
    }
    ctx.processed = true;

    // check of each conference, if user is attendee, author, reviewer, chair
    console.log(instances);

    next();
  });
};
