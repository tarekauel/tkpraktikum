angular
  .module('app')
  .controller('ConferenceController', ['$stateParams', '$scope', 'AuthService', function($stateParams, $scope, AuthService) {
    AuthService.setCurrentConferenceId($stateParams.conferenceId);
  }]);
