﻿// Code goes here

var app = angular.module("plunk", ['ct.ui.router.extras', 'ngAnimate', 'plunk.service', 'ui.bootstrap']);

app.run(function ($state, $rootScope, $location) {
    $rootScope.$state = $state;
    $rootScope.$location = $location;
})

app.config(function ($stateProvider, $stickyStateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state('modal', {
        url: '/modal',
        views: {
            'modal': {
                templateUrl: 'pages/modal.html'
               // controller: ['$scope', '$stateParams', '$state',  'modalService',
               //function ($scope, $stateParams, $state, modalService) {
                  
               //    var modalOptions = {
               //        closeButtonText: 'Cancel',
               //        actionButtonText: 'Ignore Changes',
               //        headerText: 'Unsaved Changes',
               //        bodyText: 'You have unsaved changes. Leave the page?'
               //    };

               //    modalService.showModal({}, modalOptions).then(function (result) {
               //        if (result === 'ok') {
               //            return;
               //        }
               //    });
               //}]
            }
        }
    });

    $stateProvider.state('modal.substate', {
        url: '/substate',
        template: '<h3>I\'m a substate in a modal'
    });

    $stateProvider.state('modal2', {
        url: '/modal2',
        views: {
            'modal2': {
                templateUrl: 'pages/modal2.html'
            }
        }
    });

    $stateProvider.state('modal2.substate', {
        url: '/substate',
        template: '<h3>I\'m a substate in a modal2'
    });

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
        controller: ['$scope', '$stateParams', '$state', 'CheckStateChangeService',
               function ($scope,  $stateParams, $state, CheckStateChangeService) { 
                   $scope.feedback = "";
                   $scope.saved = false;
                   // Interceptor service
                   CheckStateChangeService.checkFormOnStateChange($scope);
                   
                   $scope.save = function () {
                     
                       $scope.saved = true;
                        console.debug("$scope.feedback: " + $scope.feedback);
                          
                   };              

               }]
    });


    //$stickyStateProvider.enableDebug(true);
});