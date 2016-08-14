angular
  .module('app')
  .controller('SignupController', ['$scope', '$state', function($scope, $state) {

    $scope.createUser = function() {
      console.log(JSON.stringify($scope.newUser));
    }
  }]);
