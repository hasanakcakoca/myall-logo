(function () {
  'use strict';

  function MainController($scope, $state, $uibModal) {
    $scope.login = function () {
      const modalInstance = $uibModal.open({
        backdrop: 'static',
        windowClass: 'modal-default login',
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
