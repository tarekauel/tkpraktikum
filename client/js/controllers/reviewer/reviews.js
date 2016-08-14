angular
  .module('app')
  .controller('ReviewController', ['$scope', '$state', 'Review', 'AuthService', 'User', '$stateParams', function($scope,
                                                                         $state, Review, AuthService, User, $stateParams) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchReview   = '';     // set the default search/filter term
    $scope.reviews = [];
    $scope.newReview = {};

    function getReviews() {
      AuthService.getUserId().then(function(userId) {
        User
          .reviewer({id: userId, filter: {where: {conferenceId: $stateParams.conferenceId}}})
          .$promise
          .then(function (result) {
            $scope.reviews = result;
            $scope.count = result.length;
          });
      });
    }

    $scope.createReview = function() {
      AuthService.getUserId().then(function(userId) {
        User
          .reviews
          .create({id: userId}, $scope.newReview)
          .$promise
          .then(function () {
            $scope.newReview = {};
            $('.focus').focus();
            getReviews()
          });
      });
    };

    $scope.removeReview = function(item) {
      Review
        .deleteById(item)
        .$promise
        .then(function() {
          getReviews();
        });
    };
  }]);
