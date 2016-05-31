/**
 * Created by Nathaniel P on 5/16/2016.
 */
(function(){
    var app = angular.module('job-management-module');
    
    app.controller('ProjectListCtrl', ['$scope', '$location', 'AppFactory', 'ProjectService', 'AuthenticationService',
        function($scope, $location, AppFactory, ProjectService, AuthenticationService){

            if(!AuthenticationService.IsLoggedIn()){
                $location.path('/login');

            }else {
                $scope.authUser = AuthenticationService.GetCurrentUser();
                    
                ProjectService.GetAll().then(function (allProjects) {
                    $scope.projectList = allProjects;
                });

                $scope.editProject = function (projectId) {
                    $location.path('/project-detail/' + projectId);
                };

                $scope.deleteProject = function (projectId) {
                    ProjectService.Delete(projectId).then(function () {
                    });
                };

                $scope.createProject = function () {
                    $location.path('/project-creation');
                };
            }
    }]);

    app.controller('ProjectDetailCtrl', ['$scope', '$location', '$routeParams', 'ProjectService', 'UserService', 'AppFactory', 'AuthenticationService',
        function($scope, $location, $routeParams, ProjectService, UserService, AppFactory, AuthenticationService){
            if(!AuthenticationService.IsLoggedIn()){
                $location.path('/login');

            }else {
                $scope.authUser = AuthenticationService.GetCurrentUser();
                
                ProjectService.GetById($routeParams.id).then(function (project) {
                    project.statusId = project.statusId.toString();
                    $scope.editingProject = project;
                });

                $scope.updateProject = function () {
                    ProjectService.Update($scope.editingProject).then(function () {
                        $location.path('/project-list');
                    });
                };

                AppFactory.getProjectStatuses().then(function (statuses) {
                    $scope.projectStatuses = statuses;
                });

                UserService.GetAll().then(function (users) {
                    $scope.assignUsersList = _.where(users, {roleId: "3"});
                    ;
                });
            }
    }]);

    app.controller('ProjectCreationCtrl', ['$scope', '$location', '$routeParams', 'ProjectService', 'UserService', 'AppFactory', 'AuthenticationService',
        function($scope, $location, $routeParams, ProjectService, UserService, AppFactory, AuthenticationService){

            if(!AuthenticationService.IsLoggedIn()){
                $location.path('/login');

            }else {
                var authUser = AuthenticationService.GetCurrentUser();

                $scope.createProject = function () {
                    var project = $scope.editingProject;
                    project.createdBy = authUser.username;

                    ProjectService.Create(project).then(function () {
                        $location.path('/project-list');
                    });
                };

                AppFactory.getProjectStatuses().then(function (statuses) {
                    $scope.projectStatuses = statuses;
                });

                UserService.GetAll().then(function (users) {
                    $scope.assignUsersList = _.where(users, {roleId: "3"});
                    ;
                });
            }
    }]);
})();