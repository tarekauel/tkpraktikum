angular
  .module('app')
  .controller('ProfileController', ['$scope', 'AuthService', 'Affiliation', 'User', function ($scope, AuthService, Affiliation, User) {

    var attributes = ['title', 'firstname', 'lastname', 'profession', 'affiliation', 'zip', 'city', 'state', 'country'];
    $scope.user = {};
    $scope.affiliations = [];
    $scope.changeUserProfile = {};
    $scope.changeUserPassword = {};
    $scope.deleteUserProfile = {};
    $scope.selectedItem = null;
    $scope.changeCaret = false;

    AuthService.getUser().then(function (userData) {
      $scope.user = userData;
      attributes.map(function(p) {
        $scope.changeUserProfile[p] = userData[p] || '';
        if (p === 'affiliation') {
          $scope.selectedItem = userData[p] || null;
        }
      });
    });

    Affiliation.find().$promise.then(function (affiliations) {
      $scope.affiliations = affiliations;
    });

    $scope.dropDownItemSelected = function (selection) {
      $scope.changeCaret = !$scope.changeCaret;
      $scope.selectedItem = selection.name;
      $scope.changeUserProfile.affiliation = selection.name;
      $scope.changeUserProfile.city = selection.city;
      $scope.changeUserProfile.state = selection.state;
      $scope.changeUserProfile.country = selection.country;
    };

    $scope.changeProfile = function () {
      var updates = {};
      attributes.map(function(p) {
        if ($scope.changeUserProfile[p] !== $scope.user[p]) {
          updates[p] = $scope.changeUserProfile[p];
        }
      });
      console.log(updates);
      User.prototype$updateAttributes({id: $scope.user.id}, updates).$promise.then(function() {
        console.log("Success");
      });
    };

    $scope.deleteProfile = function () {
      console.log(JSON.stringify($scope.changeUserPassword));
    };

    $scope.changePassword = function () {
      if ($scope.changeUserPassword.newPassword == $scope.changeUserPassword.confirmNewPassword) {
        $scope.user.password = $scope.changeUserPassword.newPassword;
        var updates = {
          password: $scope.changeUserPassword.newPassword
        };
        User.prototype$updateAttributes({id: $scope.user.id}, updates).$promise.then(function() {
          console.log("Success");
        });
      }
    };

  }]);

