(function () {
  'use strict';

  function FilterController($scope, $uibModalInstance) {
    $scope.filter = function () {
      $uibModalInstance.close(
        _.pick(
          $scope,
          [
            'search',
            'clSpeCode',
            'invSpeCode',
            'onlyWithBalance',
            'onlyWithEmail'
          ]
        )
      );
    }
  }

  angular.module('app').controller('FilterController', [
    '$scope',
    '$uibModalInstance',
    FilterController
  ]);
})();
