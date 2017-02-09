(function () {
  'use strict';

  function ExportController($scope, $rootScope, $state, $uibModalInstance, Notification, ApiService) {
    $scope.export = function () {
      if (!$rootScope.token) {
        $state.go('main');
        return $uibModalInstance.dismiss('cancel');
      }

      $scope.wait = true;
      $scope.error = false;

      ApiService.import($scope.data)
        .then(result => {
          result.failed ?
            Notification.warning(`${result.total} kayıttan ${result.successful} tanesi aktarıldı.`) :
            Notification.success('Aktarım başarıyla tamamlandı.');

          $uibModalInstance.close();
        })
        .catch(err => {
          $scope.error = true;
          $scope.wait = false;
          Notification.error('Aktarım başarısız oldu.');
        });
    }
  }

  angular.module('app').controller('ExportController', [
    '$scope',
    '$rootScope',
    '$state',
    '$uibModalInstance',
    'Notification',
    'ApiService',
    ExportController
  ]);
})();
