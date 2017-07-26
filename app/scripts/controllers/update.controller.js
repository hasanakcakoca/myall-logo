(function () {
  'use strict';

  function UpdateController($scope, $uibModalInstance) {
    updater.setOptions('logger', {
        info(text) {},
        warn(text) {
          $scope.$applyAsync(() => {
            $scope.error = true;
            $scope.wait = false;
          });          
        }
    });

    updater.on('update-downloading', () => {
      $scope.$applyAsync(() => $scope.wait = true);
    });

    updater.on('update-downloaded', () => {
      updater.quitAndInstall();
    });

    $scope.update = () => {   
      $scope.$applyAsync(() => $scope.error = false);
      updater.downloadUpdate();
    };
  }

  angular.module('app').controller('UpdateController', [
    '$scope',
    '$uibModalInstance',
    UpdateController
  ]);
})();
