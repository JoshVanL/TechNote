angular.module('SimpleRESTIonic.services', [])

    .service('APIInterceptor', function ($rootScope, $q) {
        var service = this;

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return $q.reject(response);
        };
    })

    .service('ItemsModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectUsers = 'users/';
            objectItems = 'items/';

        function getUrlUsers() {
            return Backand.getApiUrl() + baseUrl + objectUsers;
        }

        function getUrlItems() {
            return Backand.getApiUrl() + baseUrl + objectItems;
        }

        function getUrlForIdItems(id) {
            return getUrlItems() + id;
        }

        function getUrlForIdUsers(id) {
            return getUrlUsers() + id;
        }

        function aNewItem(name, type, user) {
            var newItem = {
                name : name,
                type : type,
                user : user
            }

            return $http.post(getUrlItems(), newItem);
        }

        function filterGetItems() {
            var filter = '?filter=[{"fieldName":"id","operator":"greaterThan","value":"3"}]';
            return $http.get(getUrlForItems() + filter);
        }


        service.all = function () {
            return $http.get(getUrlItems());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForIdItems(id));
        };

        service.create = function (object) {
            return $http.post(getUrlItems(), object);
        };

        service.update = function (id, object) {
            return $http.put(getUrlForIdItems(id), object);
        };

        service.delete = function (id) {
            return $http.delete(getUrlForIdItems(id));
        };

    })

    .service('LoginService', function (Backand) {
        var service = this;

        service.signin = function (email, password, appName) {
            //call Backand for sign in
            return Backand.signin(email, password);
        };

        service.anonymousLogin= function(){
            // don't have to do anything here,
            // because we set app token att app.js
        }
        
        function aNewUser(email, firstname, lastname) {
            var newUser = {
                email : email,
                firstName : firstname,
                lastName : lastname
            }
            return $http.post(getUrlUsers(), newUser);
        }

        service.signup = function(firstName, lastName, email, password, confirmPassword) {
            return Backand.signup(firstName, lastName, email, password, confirmPassword);
    }

        service.signout = function () {
            return Backand.signout();
        };
    });
