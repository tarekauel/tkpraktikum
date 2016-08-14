angular
  .module('app')
  .controller('HomeController', ['$scope', 'AuthService', function ($scope, AuthService) {

    $scope.user = {};

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
    });

  }]);
