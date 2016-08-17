angular
  .module('app')
  .controller('SubmissionCreateController',
      ['$scope', '$stateParams', 'Submission', 'Tag', 'AuthService', 'Submissiontag', 'Authorship', 'User', 'Conference',
      function($scope, $stateParams, Submission, Tag, AuthService, Submissiontag, Authorship, User, Conference) {

    var conferenceId = $stateParams.conferenceId,
      asyncReq = (function () {
        var pendingRequests = 0;

        return {
          start: function () {
            if (pendingRequests === 0) $scope.pendingRequest = true;
            ++pendingRequests;
          },
          end: function () {
            --pendingRequests;
            if (pendingRequests === 0) $scope.pendingRequest = false;
          }
        };
      })(),
      dropzone = new Dropzone('#submission-file', {
        paramName: 'file',
        url: '/api/containers/submissions/upload',
        acceptedFiles: 'application/pdf,.pdf',
        autoProcessQueue: true,
        addRemoveLinks: true,
        maxFiles: 1,
        init: function () {
          this.on('sending', function () {
            asyncReq.start();
            $scope.$apply();
          });
          this.on('complete', function () {
            asyncReq.end();
            $scope.$apply();
          });
          this.on('success', function (file, response) {
            var result = response.result.files.file[0];
            $scope.submission.file = result;
            $scope.$apply();
          });
        }
      });

    $scope.submission = { authors: [], tags: [] };
    $scope.tagSuggestions = [];

    $scope.populateAutoCompleteTags = function ($select) {
      $scope.tagSuggestions = [];

      return Tag.find({filter: {
        where: {
          name: { like: '%' + $select.search.toLowerCase() + '%' }
        },
        limit: 4
      }})
      .$promise
      .then(function (tags) {
        var foundTag = false;
        $scope.tagSuggestions = $scope.tagSuggestions.concat(tags.map(function (ressource) {
          foundTag = foundTag || ressource.name.toLowerCase() === $select.search.toLowerCase();
          return ressource.toJSON();
        }));

        if ($select.search.length >= 2 && !foundTag) {
          $scope.tagSuggestions.unshift($scope.transformTag($select.search));
        }
      });
    };

    $scope.transformTag = function (tag) {
      return {id: -1, name: tag};
    };

    $scope.createTag = function ($item) {
      if ($item.id < 0) {
        asyncReq.start();

        Tag.create({}, { name: $item.name.toLowerCase() })
        .$promise
        .then(function (tag) {
          var item = _.findWhere($scope.submission.tags, {name: $item.name.toLowerCase() });

          if (item !== undefined) {
            item.id = tag.id;
          }
        })
        .finally(function () { asyncReq.end(); });
      }
    };

    $scope.addAuthorField = function (author) {
      var index = $scope.submission.authors.length + 1;
      author = author || {
        id: -1,
        username: "author" + index,
        firstname: "Author-" + index,
        lastname: "Name",
        email: "author" + index + "@example.de"
      };

      $scope.submission.authors.push(author);
    };

    $scope.removeAuthorField = function () {
      $scope.submission.authors.pop();
    };

    $scope.createSubmission = function ($event) {
      var form = $event.currentTarget;

      // TODO: Verify form! Ensure that required attributes are set!

      // Create submission
      asyncReq.start();
      Submission.create({}, {
        conferenceId: conferenceId,
        title: $scope.submission.title,
        abstract: $scope.submission.abstract
      })
      .$promise
      .then(function (submission) {
        // Link tags to submission
        _($scope.submission.tags).each(function (tag) {
          asyncReq.start();
          Submissiontag.create({
            tagId: tag.id,
            submissionId: submission.id
          }).$promise.finally(function () { asyncReq.end(); });
        });

        // Link authors to submission
        _($scope.submission.authors).each(function (author) {
          if (author.id <= 0) return;

          asyncReq.start();
          Authorship.create({
            authorId: author.id,
            submissionId: submission.id
          }).$promise.finally(function () { asyncReq.end(); });
        });

        // TODO: Link file to submission
      })
      .finally(function () { asyncReq.end(); });
    };

    Conference.findById({
      id: conferenceId,
      filter: {include: ['authors']
    }})
    .$promise
    .then(function (conference) {
      // Auto suggestion lookup table
      $scope.authors = _(conference.authors).map(function (author) {
        return _.chain(author)
          .pick('id', 'username', 'firstname', 'lastname', 'email')
          .defaults({ firstname: 'Unknown', lastname: '' })
          .value();
      });

      // Prefill current user as author
      AuthService.getUserId().then(function (userId) {
        var author = _($scope.authors).findWhere({id: userId});
        $scope.addAuthorField(author);
      });
    });
  }]);
