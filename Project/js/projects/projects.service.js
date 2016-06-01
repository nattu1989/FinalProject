/**
 * Created by Nathaniel P on 5/27/2016.
 */
(function () {
    'use strict';

    angular
        .module('job-management-module')
        .factory('ProjectService', ProjectService);

    ProjectService.$inject = ['$http', '$q', 'PROJECTS_ENDPOINT'];
    function ProjectService($http, $q, PROJECTS_ENDPOINT) {

        var service = {},
            allProjects = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByRef = GetByRef;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            var dfr = $q.defer();

            if(allProjects || allProjects.length === 0) {
                $http.get(PROJECTS_ENDPOINT).then(
                    function (projects) {
                        allProjects = projects.data;
                        dfr.resolve(projects.data);
                    },
                    function () {
                        dfr.reject({message: 'Error getting all projects'});
                    }
                );
            }
            else{
                dfr.resolve(allProjects);
            }
            return dfr.promise;
        }

        function GetById(id) {
            var dfr = $q.defer();

            $http.get(PROJECTS_ENDPOINT + '/' + id).then(
                function (project) {
                    dfr.resolve(project.data);
                },
                function () {
                    dfr.reject({message: 'Error getting project by ID'});
                }
            );

            return dfr.promise;
        }

        function GetByRef(ref) {
            var dfr = $q.defer();

            $http.get(PROJECTS_ENDPOINT + '?ref=' + ref).then(
                function (project) {
                    dfr.resolve(project.data);
                },
                function () {
                    dfr.reject({message: 'Error getting project by ID'});
                }
            );

            return dfr.promise;
        }

        function Create(project) {

            var dfr = $q.defer();

            GetByRef(project.ref)
            .then(
                function (chkProj) {
                    if (chkProj !== null && chkProj.length !== 0) {
                        alert("A project with REF: " + project.ref + " already exists!");
                        dfr.reject({ message: "A project with REF: " + project.ref + " already exists!" });
                    } else {
                        $http.post(PROJECTS_ENDPOINT, project).then(
                            function (project) {
                                dfr.resolve(project.data);
                            },
                            function () {
                                dfr.reject({message: 'Error creating project'});
                            }
                        );
                    }
                },
                function(error){
                    dfr.reject(error);
                });

            return dfr.promise;
        }

        function Update(project) {

            var dfr = $q.defer();

            $http.put(PROJECTS_ENDPOINT + '/' + project.id, project).then(
                function(project){
                    dfr.resolve(project.data);
                },
                function(){
                    dfr.reject({ message: 'Error updating project' });
                }
            );

            return dfr.promise;
        }

        function Delete(id) {

            var dfr = $q.defer();

            $http.delete(PROJECTS_ENDPOINT + '/' + id).then(
                function(){
                    var projectNdx = _.findIndex(allProjects, {id: id});
                    allProjects.splice(projectNdx, 1);
                    dfr.resolve();
                },
                function(){
                    dfr.reject({ message: 'Error deleting project' });
                }
            );

            return dfr.promise;
        }
    }
})();
