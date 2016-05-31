/**
 * Created by Nathaniel P on 5/28/2016.
 */

(function () {
    'use strict';

    angular
        .module('job-management-module')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$q', '$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
    function AuthenticationService($q, $http, $cookieStore, $rootScope, $timeout, UserService) {

        var service = {};

        service.Login = Login;
        service.IsLoggedIn = IsLoggedIn;
        service.GetCurrentUser = GetCurrentUser;
        service.Logout = Logout;

        return service;

        function Login(username, password) {
            var dfr = $q.defer();

            UserService
                .GetByUsername(username)
                .then(
                    function (user) {
                        if (user !== null && user.password === password) {
                            $cookieStore.put('user', user);
                            dfr.resolve(user);
                        } else {
                            alert("Username or password is incorrect!");
                            dfr.reject({ message: 'Username or password is incorrect' });
                        }
                    },
                    function(error){
                        dfr.reject(error);
                    });

            return dfr.promise;
        }

        function IsLoggedIn(){
            return $cookieStore.get('user') !== undefined;
        }

        function GetCurrentUser(){
            return $cookieStore.get('user');
        }

        function Logout() {
            var dfr = $q.defer();

            $cookieStore.remove('user');

            dfr.resolve();

            return dfr.promise;
        }
    }
})();