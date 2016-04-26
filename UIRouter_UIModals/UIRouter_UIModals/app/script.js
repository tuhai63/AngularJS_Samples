function defineModal() {
    return {
        templateUrl: 'modal.html',
        controller: 'ModalCtrl',
        resolve: {
            resolved: function ($rootScope, $q) {
                return $rootScope.flag.resolve ? $q.when({ stuff: 'asynchronous' }) : { stuff: 'synchronous' }
            }
        }
    };
}

function bindModal(modal) {
    modal.opened.then(function () {
        console.log('client: opened');
    });
    modal.result.then(function (result) {
        console.log('client: resolved: ' + result);
    }, function (reason) {
        console.log('client: rejected: ' + reason);
    });
}

angular
  .module('test', ['ui.router', 'ui.bootstrap', 'modalstate'])

  .directive('modalButtons', function () {
      return {
          restrict: 'E',
          replace: true,
          controller: function ($scope, $modal) {
              $scope.modal = function () {
                  bindModal($modal.open(defineModal()));
              };
          },
          template: '<div class="panel panel-default"><div class="panel-body">'
            + '<button class="btn btn-link" ng-click="modal()" tooltip-placement="right" tooltip="Open another modal using $modal directly.">$modal</button><br />'
            + '<button class="btn btn-link" ui-sref=".modal" tooltip-placement="right" tooltip="Open a nested modal using a state transition.  Inherits from $rootScope.">ui-sref</button><br />'
            + '<button class="btn btn-link" ui-sref=".modal" modal-scope tooltip-placement="right" tooltip="Open a nested modal using a state transition.  Inherits from the current scope.">ui-sref modal-scope</button><br />'
            + '</div></div>'
      };
  })

  .config(function ($stateProvider, modalStateProvider, $urlRouterProvider) {

      $stateProvider.state('main', {
          url: '/',
          template: '<pre>$state.name = {{$state.current.name}}</pre>'
            + '<label><input type="checkbox" ng-model="flag.resolve" /> Resolve a promise before each modal.</label><br />'
            + '<modal-buttons></modal-buttons>'
      });

      (function modalState(parent, depth) {
          var stateName = parent + '.modal';

          modalStateProvider.state(stateName, _.extend(defineModal(), {
              url: 'modal/',
              onModal: function (modal) {
                  console.log('client: onModal');
                  bindModal(modal);
              },
              onEnter: function () {
                  console.log('client: onEnter');
              },
              onExit: function () {
                  console.log('client: onExit');
              },
          }));

          if (depth > 0) {
              modalState(stateName, depth - 1);
          }
      })('main', 20);

      $urlRouterProvider.otherwise('/');
  })

  .controller('MainCtrl', function ($rootScope, $scope, $state, $modal) {
      $rootScope.$state = $state;
      $rootScope.flag = { resolve: true, leavable: true };

      console.log('client[' + $scope.$id + ']: main controller');

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          console.log('$stateChangeStart: ' + fromState.name + ' => ' + toState.name);
          if (!$rootScope.flag.leavable) {
              console.log('client: $stateChangeStart: veto due to flag');
              event.preventDefault();
          }
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
          console.log('$stateChangeSuccess: ' + fromState.name + ' => ' + toState.name);
      });
  })

  .controller('ModalCtrl', function ($rootScope, $scope, $modalInstance, $modalStack, modalState, resolved) {

      $scope.local = { closeMode: '1' };

      $scope.depth = ($scope.depth || 0) + 1;

      $scope.isStateBased = function () {
          return modalState.isTop();
      };

      var prefix = 'client[' + $scope.$id + ']: ';
      console.log(prefix + 'modal controller, resolved = ' + angular.toJson(resolved));

      $scope.$on('modal.closing', function (event, reason, closed) {
          console.log(prefix + 'modal.closing: ' + (closed ? 'close' : 'dismiss') + '(' + reason + ')');
          if ($scope.local.closeMode === '1') {
              // allow
          } else if ($scope.local.closeMode === '2') {
              if (!confirm('Are you sure?')) {
                  console.log('\t' + prefix + 'veto (interactive)');
                  event.preventDefault();
              }
          } else if ($scope.local.closeMode === '3') {
              console.log('\t' + prefix + 'veto (deterministic)');
              event.preventDefault();
          }
      });
      $scope.$on('$destroy', function () {
          console.log(prefix + '$destroy');
      });

      $scope.ok = function () {
          console.log(prefix + '$close returned ' + $scope.$close('ok'));
      };

      $scope.cancel = function () {
          console.log(prefix + '$dismiss returned ' + $scope.$dismiss('cancel'));
      };

      $scope.dismissAll = function () {
          if (modalState.getDepth() > 0) {
              console.log(prefix + 'dismissAll (state-based)');
              modalState.dismissAll('all:state-based').then(function (x) {
                  console.log(prefix + 'dismissAll resolved: ' + x);
              }, function (x) {
                  console.log(prefix + 'dismissAll rejected: ' + x);
              });
          } else {
              console.log(prefix + 'dismissAll (native)');
              $modalStack.dismissAll('all:native');
          }
      };
  })

;