(function () {
  'use strict';

  angular.module('app')
    .controller('MainController', ['$uibModal', MainController]);

  function MainController($uibModal) {
    this.login = function () {
      $uibModal.open({
        backdrop: 'static',
        windowClass: 'modal-default login',
        controllerAs: 'vm',
        controller: 'LoginController',
        templateUrl: './templates/login.html'
      });
    }
  }
})();
