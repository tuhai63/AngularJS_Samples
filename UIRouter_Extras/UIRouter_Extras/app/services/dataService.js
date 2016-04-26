angular.module('plunk.data.service', [])

// A RESTful factory for retrieving contacts from 'contacts.json'
.factory('usersService', ['$http', 'utils', function ($http, utils) {
    var path = 'assets/data.json';

    var users = $http.get(path).then(function (resp) {
     // console.debug("my data " + resp.data.users[0].id);
        //console.debug(resp.data.submissions[0].submission_version_date);
        return resp.data.users;
    });

    var factory = {};
    factory.all = function () {
        return users;
    };

    factory.get = function (id) {
        return users.then(function () {
            return utils.findById(users, id);
        });
    };
    return factory;
}])
