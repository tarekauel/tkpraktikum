angular
  .module('app')
  .controller('JoinConferenceController', ['$scope', '$state', '$http' , 'AuthService', 'User', 'Conference',
    function($scope, $state, $http, AuthService, User, Conference) {

      $scope.conference = {};

      $scope.join = function() {
        AuthService.getUserId().then(function(userId) {
          Conference
            .find({filter: {where: {name: $scope.conference.name, sharedSecret: $scope.conference.sharedSecret}}})
            .$promise
            .then(function(res) {
              if (res.length == 0) {
                return console.error("No conference found");
              } else {
                User
                  .attendee
                  .link({id: userId, fk: res[0].id},
                    {attendeeId: userId, conferenceId: res[0].id})
                  .$promise.then(function() {
                    //TODO: goto MY CONFERENCES
                })
              }
            })
        });
      };
    }]);
