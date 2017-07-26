(function () {
  'use strict';

  function MainController($scope, $rootScope, $state, $timeout, $uibModal) {    
    $scope.update = meta => {
      let modalScope = $rootScope.$new();

      angular.extend(modalScope, meta);

      const modalInstance = $uibModal.open({
        backdrop: 'static',
        windowClass: 'modal-default',
        controller: 'UpdateController',
        templateUrl: './templates/update.html',

        scope: modalScope
      });  
      
      if (!isDevelopment) {
        modalInstance.result.catch(() =>
          $rootScope.close()
        );   
      }   
    }

    $scope.login = () => {
      const modalInstance = $uibModal.open({
        size: 'sm',
        backdrop: 'static',
        windowClass: 'modal-default',
        controller: 'LoginController',
        templateUrl: './templates/login.html'
      });

      modalInstance.result.then(() => $state.go('transactions'));
    }

    $timeout(() => {
      updater.on('update-available', $scope.update);
      updater.checkForUpdates();
    }, 500); 
  }

  angular.module('app').controller('MainController', [
    '$scope',
    '$rootScope',
    '$state',
    '$timeout',
    '$uibModal',
    MainController
  ]);
})();
