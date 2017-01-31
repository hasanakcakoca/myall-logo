(function () {
  'use strict';

  function TransactionsController($scope, $rootScope) {
    this.$onInit = function () {
      if (!$rootScope.connection) {
        $rootScope.showConnectionSettings();
      }
    }
  }

  angular.module('app').controller('TransactionsController', [
    '$scope',
    '$rootScope',
    TransactionsController
  ]);
})();
