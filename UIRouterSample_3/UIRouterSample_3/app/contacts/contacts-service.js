angular.module('uiRouterSample.contacts.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
.factory('contacts', ['$http', 'utils', function ($http, utils) {
    var path = 'assets/contacts.json';
    
    var contacts = $http.get(path).then(function (resp) {
        
        return resp.data.contacts;
    });

  var factory = {};
  factory.all = function () {
    return contacts;
  };

  factory.get = function (id) {
    return contacts.then(function(){
      return utils.findById(contacts, id);
    })
  };
  return factory;
}])

.factory('CheckStateChangeService', function ($rootScope) {

    var addCheck = function ($scope) {

        var removeListener = $rootScope.$on('$stateChangeStart'
                    , function (event, toState, toParams, fromState, fromParams) {
                        //$pristine: It will be TRUE, if the user has not interacted with the form yet
                        if ($scope.form.$pristine) {
                            return;
                        }

                        var canContinue = confirm("The form has change, do you want to continue without saving");
                        if (canContinue) {
                            return
                        }
                        event.preventDefault();
                    });

        $scope.$on("$destroy", removeListener);
    };

    return { checkFormOnStateChange: addCheck };
})
