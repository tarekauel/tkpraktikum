angular
  .module('app')
  .controller('MyConferencesController', ['$q', '$scope', '$state', '$http' , 'AuthService', 'User', 'Conference',
    function($q, $scope, $state, $http, AuthService, User, Conference) {

      $scope.conferenceList = [];

      var getConferences = function() {
        var toIdList = function(userList) {
          return userList.map(function (user) {
            return user.id;
          });
        };
        AuthService.getUser().then(function(user) {
          var userId = user.id;
          $q.all([
            User.attendee({id: userId}).$promise,
            User.chair({id: userId}).$promise.then(toIdList),
            User.author({id: userId}).$promise.then(toIdList),
            User.reviewer({id: userId}).$promise.then(toIdList)
          ]).then(function(conferenceLists) {
            $scope.conferenceList = conferenceLists[0].map(function (conference) {
              conference.isChair = conferenceLists[1].indexOf(conference.id) !== -1;
              conference.isAuthor = conferenceLists[2].indexOf(conference.id) !== -1;
              conference.isReviewer = conferenceLists[3].indexOf(conference.id) !== -1;
              conference.isDefault = conference.id == user.defaultConferenceId;
              return conference;
            });
          });
        });
      };
      getConferences();

      $scope.setDefault = function(conference) {
        AuthService.getUser().then(function(user) {
          User.prototype$updateAttributes({id: user.id}, {defaultConferenceId: conference.id});
        });
      };

    }]);
