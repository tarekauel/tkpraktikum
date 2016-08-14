angular
  .module('app')
  .controller('SubmissionController', ['$scope', 'AuthService', '$state', '$stateParams', 'User', function($scope, AuthService,
                                                                    $state, $stateParams, User) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchSubmission   = '';     // set the default search/filter term
    $scope.submissions = [];
    $scope.newSubmission = {};

    function getSubmissions() {
      AuthService.getUserId().then(function(userId) {
        User
          .submissions({id: userId, filter: { where: {conferenceId: $stateParams.conferenceId}}})
          .$promise
          .then(function(result) {
            $scope.submissions = result;
            $scope.count = result.length;
          });
      });
    }

    $scope.createSubmission = function() {
      AuthService.getUserId().then(function(userId) {
        $scope.newSubmission.conferenceId = $stateParams.conferenceId;
        User
          .submissions
          .create({id: userId}, $scope.newSubmission)
          .$promise
          .then(function () {
            $scope.newSubmission = {};
            $('.focus').focus();
            getSubmissions()
          });
      });
    };

    $scope.removeSubmission = function(item) {
      Submission
        .deleteById(item)
        .$promise
        .then(function() {
          getSubmissions();
        });
    };
  }]);
