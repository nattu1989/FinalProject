/**
 * Created by Nathaniel P on 5/16/2016.
 */
(function(){
    var app = angular.module('job-management-module');

    app.controller('UserListCtrl', ['$scope', '$location', 'AppFactory', 'UserService', 'AuthenticationService',
        function($scope, $location, AppFactory, UserService, AuthenticationService){

        if(!AuthenticationService.IsLoggedIn()){
            $location.path('/login');

        }else{
            var authUser = AuthenticationService.GetCurrentUser();

            UserService.GetAll().then( function(allUsers){
                $scope.userList = allUsers;
            });

            $scope.editUser = function(userId){
                $location.path('/user-detail/' + userId);
            };

            $scope.deleteUser = function(userId){
                UserService.Delete(userId).then( function(){
                    $location.path('/user-list');
                });
            };

            $scope.createUser = function() {
                $location.path('/user-creation');
            }

            $scope.canEditUser = function(userInList){
                if(authUser.roleId == 3 && authUser.username != userInList.username){ //staff
                    return false;
                }
                else if(authUser.roleId == 2 && authUser.username != userInList.username && userInList.roleId == 2){ //manager
                    return false;
                }
                else{ //admin
                    return true;
                }
            };
        }
    }]);

    app.controller('UserDetailCtrl', ['$scope', '$location', '$routeParams','UserService','AuthenticationService',
        function($scope, $location, $routeParams, UserService, AuthenticationService){

            if(!AuthenticationService.IsLoggedIn()){
                $location.path('/login');

            }else {
                UserService.GetById($routeParams.id).then(function (user) {
                    user.roleId = user.roleId.toString();
                    $scope.editingUser = user;
                });
                ;

                $scope.updateUser = function () {
                    UserService.Update($scope.editingUser).then(function () {
                        $location.path('/user-list');
                    });
                };
            }
    }]);

    app.controller('UserCreationCtrl', ['$scope', '$location', '$routeParams', 'UserService', 'AuthenticationService',
        function($scope, $location, $routeParams, UserService, AuthenticationService){

            if(!AuthenticationService.IsLoggedIn()){
                $location.path('/login');

            }else {
                $scope.createUser = function () {
                    UserService.Create($scope.editingUser).then(function () {
                        $location.path('/user-list');
                    });
                }
            }
    }]);
})();