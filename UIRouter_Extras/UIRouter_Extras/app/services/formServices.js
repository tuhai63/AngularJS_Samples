angular.module('plunk.service', [

])

.factory('CheckStateChangeService', function ($rootScope) {

    var addCheck = function ($scope) {
        var removeListener = $rootScope.$on('$stateChangeStart'
                    , function (event, toState, toParams, fromState, fromParams) {
                        //$pristine: It will be TRUE, if the user has not interacted with the form yet
                        // when user successfully saved form then $scope.saved must set to be true
                        if ($scope.form1.$pristine || $scope.saved) {
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
