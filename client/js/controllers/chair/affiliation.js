angular
  .module('app')
  .controller('AffiliationController', ['$scope', '$state', 'Affiliation', function($scope,
                                                                    $state, Affiliation) {

    // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchAffiliation   = '';     // set the default search/filter term
    $scope.affiliations = [];
    function getAffiliations() {
      Affiliation
        .find()
        .$promise
        .then(function(results) {
          $scope.affiliations = results;
        });
    }
    getAffiliations();

    $scope.createAffiliation = function() {
      Affiliation
        .create($scope.newAffiliation)
        .$promise
        .then(function () {
          $scope.newAffiliation = {};
          $('.focus').focus();
          getAffiliations()
        });
    };

    $scope.removeAffiliation = function(item) {
      Affiliation
        .deleteById(item)
        .$promise
        .then(function() {
          getAffiliations();
        });
    };
  }]);
