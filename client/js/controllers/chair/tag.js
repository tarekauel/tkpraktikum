angular
  .module('app')
  .controller('TagController', ['$scope', '$state', '$stateParams', 'Tag', function($scope,
                                                                      $state, $stateParams, Tag) {
    $scope.tags = [];
    function getTags() {
      Tag
        .find()
        .$promise
        .then(function(results) {
          $scope.tags = results;
        });
    }
    getTags();

    $scope.addTag = function() {
      Tag
        .create($scope.newTag)
        .$promise
        .then(function(tag) {
          $scope.newTag = '';
          $scope.tagForm.name.$setPristine();
          $('.focus').focus();
          getTags();
        });
    };

    $scope.removeTag = function(item) {
      Tag
        .deleteById(item)
        .$promise
        .then(function() {
          getTags();
        });
    };
  }]);
