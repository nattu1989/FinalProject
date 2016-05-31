/**
 * Created by Nathaniel P on 5/27/2016.
 */
(function () {
    'use strict';

    angular
        .module('job-management-module')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$q', 'USERS_ENDPOINT'];
    function UserService($http, $q, USERS_ENDPOINT) {

        var service = {},
            allUsers = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {

            var dfr = $q.defer();

            $http.get(USERS_ENDPOINT).then(
                function(users){
                    allUsers = users.data;
                    dfr.resolve(users.data);
                },
                function(){
                    dfr.reject({ message: 'Error getting all users' });
                }
            );

            return dfr.promise;
        }

        function GetById(id) {
            var dfr = $q.defer();

            $http.get(USERS_ENDPOINT + '/' + id).then(
                function (user) {
                    dfr.resolve(user.data);
                },
                function () {
                    dfr.reject({message: 'Error getting user by id'});
                }
            );

            return dfr.promise;
        }

        function GetByUsername(username) {
            var dfr = $q.defer();

            $http.get(USERS_ENDPOINT + '?username=' + username).then(
                function(user){
                    if(user.data.length){
                        dfr.resolve(user.data[0]);
                    } else {
                        dfr.resolve(null);
                    }
                },
                function(){
                    dfr.reject({ message: 'Error getting user by username' });
                }
            );

            return dfr.promise;
        }

        function Create(user) {
            var dfr = $q.defer();

            GetByUsername(user.username)
                .then(
                    function (chkUser) {
                        if (chkUser !== null && chkUser.length !== 0) {
                            alert("A user with username '" + user.username + "' already exists!");
                            dfr.reject({ message: "A user with username '" + user.username + "' already exists!" });
                        }
                        else{
                            $http.post(USERS_ENDPOINT, user).then(
                                function (user) {
                                    dfr.resolve(user.data);
                                },
                                function () {
                                    dfr.reject({message: 'Error creating user'});
                                }
                            );
                        }
                    },
                    function(){
                        dfr.reject({message: 'Error creating user'});
                    });

            return dfr.promise;
        }

        function Update(user) {

            var dfr = $q.defer();

            $http.put(USERS_ENDPOINT + '/' + user.id, user).then(
                function(user){
                    dfr.resolve(user.data);
                },
                function(){
                    dfr.reject({ message: 'Error updating user' });
                }
            );

            return dfr.promise;
        }

        function Delete(id) {

            var dfr = $q.defer();

            $http.delete(USERS_ENDPOINT + '/' + id).then(
                function(){
                    var userNdx = _.findIndex(allUsers, {id: id});
                    allUsers.splice(userNdx, 1);
                    dfr.resolve();
                },
                function(){
                    dfr.reject({ message: 'Error deleting user' });
                }
            );

            return dfr.promise;
        }
    }
})();