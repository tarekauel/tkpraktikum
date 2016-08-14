angular
  .module('app')
  .controller('ChairUserManagementController',
      ['$q', '$scope', '$state', '$stateParams', '$http' , 'AuthService', 'User', 'Conference',
      function($q, $scope, $state, $stateParams, $http, AuthService, User, Conference) {

        // sort by https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
        $scope.sortType     = 'name'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchUser   = '';     // set the default search/filter term
        $scope.userList = [];

        function getUsers() {
          var toIdList = function(userList) {
            return userList.map(function (user) {
              return user.id;
            });
          };
          AuthService.getUserId().then(function(userId) {
            $q.all(
              [
                Conference.attendees({id: $stateParams.conferenceId}).$promise,
                Conference.chairs({id: $stateParams.conferenceId}).$promise.then(toIdList),
                Conference.authors({id: $stateParams.conferenceId}).$promise.then(toIdList),
                Conference.reviewer({id: $stateParams.conferenceId}).$promise.then(toIdList)
              ]
            ).then(function (userLists) {
              $scope.userList = userLists[0].map(function (user) {
                user.isChair = userLists[1].indexOf(user.id) !== -1;
                user.isAuthor = userLists[2].indexOf(user.id) !== -1;
                user.isReviewer = userLists[3].indexOf(user.id) !== -1;
                user.isMe = (user.id === userId);
                return user;
              });
            }).catch(console.error);
          });
        }
        getUsers();

        $scope.changeAuthor = function(user) {
          if (user.isAuthor) {
            User
              .author
              .link({id: user.id, fk: $stateParams.conferenceId},
                {conferenceId: $stateParams.conferenceId})
              .$promise.then(function () {
                getUsers();
            });
          } else {
            User
              .author
              .unlink({id: user.id, fk: $stateParams.conferenceId},
                {conferenceId: $stateParams.conferenceId})
              .$promise.then(function () {
                getUsers();
            })
          }
        };

        $scope.changeReviewer = function(user) {
          if (user.isReviewer) {
            User
              .reviewer
              .link({id: user.id, fk: $stateParams.conferenceId},
                {conferenceId: $stateParams.conferenceId})
              .$promise.then(function () {
              getUsers();
            });
          } else {
            User
              .reviewer
              .unlink({id: user.id, fk: $stateParams.conferenceId},
                {conferenceId: $stateParams.conferenceId})
              .$promise.then(function () {
              getUsers();
            })
          }
        };

        $scope.changeChair = function(user) {
          AuthService.getUserId().then(function(userId) {
            if (user.id == userId) {
              return;
            }
            if (user.isChair) {
              User
                .chair
                .link({id: user.id, fk: $stateParams.conferenceId},
                  {conferenceId: $stateParams.conferenceId})
                .$promise.then(function () {
                getUsers();
              });
            } else {
              User
                .chair
                .unlink({id: user.id, fk: $stateParams.conferenceId},
                  {conferenceId: $stateParams.conferenceId})
                .$promise.then(function () {
                getUsers();
              })
            }
          });
        };
  }]);
