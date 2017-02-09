(function () {
  'use strict';

  function MainController($scope, $state, $uibModal) {
    $scope.login = function () {
      const modalInstance = $uibModal.open({
        size: 'sm',
        backdrop: 'static',
        windowClass: 'modal-default',
        controller: 'LoginController',
        templateUrl: './templates/login.html'
      });

      modalInstance.result.then(() => $state.go('transactions'));
    }
  }

  angular.module('app').controller('MainController', [
    '$scope',
    '$state',
    '$uibModal',
    MainController
  ]);
})();
