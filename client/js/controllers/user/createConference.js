angular
  .module('app')
  .controller('CreateConferenceController', ['$scope', '$state', '$http' , 'AuthService', 'User', 'Conference',
    function($scope, $state, $http, AuthService, User, Conference) {

      $scope.conference = {};

      $scope.create = function() {
        AuthService.getUserId().then(function(userId) {
          User
            .chair
            .create({id: userId}, $scope.conference)
            .$promise
            .then(function (conference) {
              User
                .attendee
                .link({id: userId, fk: conference.id},
                  {attendeeId: userId, conferenceId: conference.id})
                .$promise
                .then(function () {
                  // TODO goto my conference
                });
            });
        });
      }
    }]);
