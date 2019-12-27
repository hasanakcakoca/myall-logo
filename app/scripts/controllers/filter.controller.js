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
            'onlyWithEmail',
            'useMinimumTotal',
            'minimumTotal'
          ]
        )
      );
    }

    $scope.setMinimumTotal = function () {
      if (!$scope.useMinimumTotal) {
        $scope.minimumTotal = 0;
      }
    }
  }

  angular.module('app').controller('FilterController', [
    '$scope',
    '$uibModalInstance',
    FilterController
  ]);
})();
