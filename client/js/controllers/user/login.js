angular
  .module('app')
  .controller('LoginController', ['$scope', '$state', 'AuthService',
    function ($scope, $state, AuthService) {
      $scope.login = function () {
        AuthService
          .login($scope.user.username, $scope.user.password)
          .then(function (user) {
            $state.go('app.protected.home', {}, {reload: true});
          });
      }
    }])
  .controller('LogoutController', ['$scope', '$state', 'AuthService',
    function ($scope, $state, AuthService) {

      AuthService
        .logout()
        .then(function () {
          $state.go('app.login', {}, {reload: true});
        });
    }])
  .controller('HeaderCtrl', [function () {
  }]);
