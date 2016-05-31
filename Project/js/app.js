(function(){

    var app = angular.module('job-management-module', ['ngRoute', 'ngCookies']);

    //Routing
    app.config(['$routeProvider', function($routeProvider){
        $routeProvider
        .when('/', {
            templateUrl: 'project-list.html',
            controller:'ProjectListCtrl'
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller:'MainCtrl'
        }).when('/project-list', {
            templateUrl: 'project-list.html',
            controller:'ProjectListCtrl'
        }).when('/project-creation', {
            templateUrl: 'project-create.html',
            controller:'ProjectCreationCtrl'
        }).when('/project-detail/:id', {
            templateUrl: 'project-edit.html',
            controller:'ProjectDetailCtrl'
            
        }).when('/user-list', {
            templateUrl: 'user-list.html',
            controller:'UserListCtrl'
        }).when('/user-creation', {
            templateUrl: 'user-create.html',
            controller:'UserCreationCtrl'
        }).when('/user-detail/:id', {
            templateUrl: 'user-edit.html',
            controller:'UserDetailCtrl'
        }).otherwise({redirectTo: '/project-list' });
    }]);

    app.factory('AppFactory', function($http, $q, AuthenticationService){
       var roles = [{
            "roleId": 1,
            "name": "Admin"
        }, {
            "roleId": 2,
            "name": "Manager"
        }, {
            "roleId": 3,
            "name": "Staff"
        }];

        var projectStatuses =[{
            "id": 1,
            "name": "Pending"
        }, {
            "id": 2,
            "name": "In Progress"
        }, {
            "id": 3,
            "name": "Completed"
        }];

        return {
            getRoles: function(){
                var deferred = $q.defer();
                deferred.resolve(roles);
                return deferred.promise;
            },
            getProjectStatuses: function(){
                var deferred = $q.defer();
                deferred.resolve(projectStatuses);
                return deferred.promise;
            }
        }
    });

    //Main Controller
    app.controller('MainCtrl', ['$scope', '$location', 'AppFactory', 'UserService', 'AuthenticationService',
        function($scope, $location, AppFactory, UserService, AuthenticationService){
            $scope.loginCredentials = {};
            $scope.authUser = AuthenticationService.GetCurrentUser();

            $scope.login = function () {
                AuthenticationService.Login($scope.loginCredentials.username, $scope.loginCredentials.password).then(function () {
                    $scope.authUser = AuthenticationService.GetCurrentUser();
                    $location.path('/project-list');
                });
            }

            $scope.logout = function () {
                AuthenticationService.Logout().then(function () {
                    $scope.authUser = null;
                    $location.path('/login');
                });
            };

            var allRoles = {};
            var allStatuses = {};

            UserService.GetAll().then(function (allUsers) {
                $scope.userList = _.sortBy(allUsers, function (user) {
                    return user.roleId;
                });
            });

            AppFactory.getProjectStatuses().then(function (status) {
                allStatuses = status;
                $scope.statusesList = allStatuses;
            });

            AppFactory.getRoles().then(function (roles) {
                allRoles = roles;
                $scope.rolesList = allRoles;
            });

            $scope.getRoleName = function (roleId) {
                var role = _.find(allRoles, function (role) {
                    return role.roleId == roleId;
                });
                return role.name;
            };

            $scope.getProjectStatusName = function (statusId) {
                var status = _.find(allStatuses, function (status) {
                    return status.id == statusId;
                });
                return status.name;
            };
    }]);

})();


