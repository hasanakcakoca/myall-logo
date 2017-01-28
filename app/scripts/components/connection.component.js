(function () {
  'use strict';

  angular.module('app')
    .factory('ConnectionService', ['$uibModal', ConnectionService])
    .controller('ConnectionController', ConnectionController);

  function ConnectionController() {
    const service = ConnectionService;
  }

  function ConnectionService($uibModal) {
    return {
      settings: {
        show: function () {
          $uibModal.open({
            backdrop: 'static',
            windowClass: 'modal-default',
            controllerAs: 'vm',
            controller: 'ConnectionController',
            templateUrl: './templates/connection.html'
          });
        }
      }
    }
  }
})();
