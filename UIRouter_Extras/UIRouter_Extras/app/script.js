// Code goes here

var app = angular.module("plunk", ['ct.ui.router.extras', 'ngAnimate', 'ui.bootstrap', 'plunk.utils.service', 'plunk.data.service', 'plunk.interceptor.service', ]);

app.run(function ($state, $rootScope, $location) {
    $rootScope.$state = $state;
    $rootScope.$location = $location;
})

app.config(function ($stateProvider, $stickyStateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    // This for generic modal popup
    $stateProvider.state('modal', {
        url: '/modal',
        views: {
            'modal': {
                templateUrl: 'pages/modal.html',
                controller: ['$scope', '$stateParams', '$state',  'modalService',
               function ($scope, $stateParams, $state, modalService) {
                 
                   var modalOptions = {
                       closeButtonText: 'Cancel',
                       actionButtonText: 'Ignore Changes',
                       headerText: 'Unsaved Changes',
                       bodyText: 'You have unsaved changes. Leave the page?'
                   };

                   modalService.showModal({}, modalOptions).then(function (result) {
                       if (result === 'ok') {
                           return $state.go('app');
                       }
                   });
               }]
            }
        }
    });

    $stateProvider.state('modal.substate', {
        url: '/substate',
        template: '<h3>I\'m a substate in a modal'
    });


    //$stateProvider.state('modal2', {
    //    url: '/modal2',
    //    views: {
    //        'modal2': {
    //            templateUrl: 'pages/modal.html'
    //        }
    //    }
    //});

    //$stateProvider.state('modal2.substate', {
    //    url: '/substate',
    //    template: '<h3>I\'m a substate in a modal2'
    //});

    $stateProvider.state('app', {
        url: '',
        views: {
            'app': {
                templateUrl: 'app.html'
            }
        },
        sticky: true,
        dsr: true
    });

    $stateProvider.state('app.account', {
        url: '/account',
        templateUrl: 'account.html'
    });

    $stateProvider.state('app.account.stuff', {
        url: '/stuff',
        template: "<h3>Here's my stuff:</h3><ul><li>stuff 1</li><li>stuff 2</li><li>stuff 3</li></ul>"
    });

    $stateProvider.state('app.account.things', {
        url: '/things',
        template: "<h3>Here are my things:</h3><ul><li>thing a</li><li>thing b</li><li>thing c</li></ul>"
    });

    $stateProvider.state('app.survey', {
        url: '/survey',
        templateUrl: 'pages/survey.html',
        controller: ['$scope', '$stateParams', '$state','$uibModal', 'CheckStateChangeService','usersData', 'utils',
               function ($scope,  $stateParams, $state, $uibModal, CheckStateChangeService, usersData, utils) { 
                   $scope.feedback = "";
                   $scope.saved = false;
                   // Interceptor service
                   CheckStateChangeService.checkFormOnStateChange($scope);
                   
                   $scope.save = function () {
                       $scope.saved = true;
                        console.debug("$scope.feedback: " + $scope.feedback);             
                   };
                   $scope.user = {
                        firstname: 'Doo',
                        lastname: 'Soobi'
                   };
                   // Test only
                   $scope.item = utils.findById(usersData, "1");
                   console.debug($scope.item);
                   // open modal
                   $scope.open = function (user) {
                       //$scope.user = user;
                       $uibModal.open({
                           templateUrl: 'pages/myModalContent.html',
                           backdrop: true,
                           windowClass: 'modal',
                           controller: function ($scope, $uibModalInstance, $log, user) {
                               $scope.user = user;
                               $scope.submit = function () {
                                   $log.log('Submiting user info.');
                                   $log.log(JSON.stringify(user));
                                   $uibModalInstance.dismiss('cancel');
                               }
                               $scope.cancel = function () {
                                   $uibModalInstance.dismiss('cancel');
                               };
                           },
                           resolve: {
                               user: function () {
                                   return $scope.user;
                               }
                           }
                       });
                   };
               }]
    });


    //$stickyStateProvider.enableDebug(true);
});