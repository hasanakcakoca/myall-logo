(function () {
  'use strict';

  const exportCount = 1000;

  function ExportController($scope, $rootScope, $state, $uibModalInstance, Notification, ApiService) {
    $scope.export = function () {
      if (!$rootScope.token) {
        $state.go('main');
        return $uibModalInstance.dismiss('cancel');
      } 

      let successful = 0;
      let total = $scope.data.length;      

      let stepIt = err => {
        if (err) {
          log.error(err);
        }

        if ($scope.step === $scope.groupCount) {
          $scope.wait = false;      
          
          if (successful === 0) {
            $scope.error = true;
            Notification.error('Aktarım başarısız oldu.');
          }
          else {
            (successful < total) ? 
              Notification.warning(`${total} kayıttan ${successful} tanesi aktarıldı.`) :
              Notification.success('Aktarım başarıyla tamamlandı.');
            
            $uibModalInstance.close();
          }
          
          return;
        }

        let start = $scope.step++ * exportCount;
        let end = start + exportCount;
        let data = $scope.data.slice(start, end);
        let preventRefresh = $scope.step !== $scope.groupCount;

        ApiService.import(data, preventRefresh)
          .then(result => {
            successful += result.successful;
            stepIt();
          })
          .catch(stepIt);        
      }

      $scope.wait = true;
      $scope.error = false;

      $scope.step = 0;
      $scope.groupCount = Math.ceil(total / exportCount);

      stepIt();
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
