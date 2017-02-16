(function () {
  'use strict';

  function ConnectionController($scope,
                                $timeout,
                                $uibModalInstance,
                                Notification,
                                ConnectionService) {
    $scope.save = function (form) {
      if (!form.$valid) return;

      const cs = ConnectionService;

      const config = _.pick($scope, [
        'server',
        'database',
        'user',
        'password'
      ]);

      $scope.wait = true;

      $timeout(() =>
        cs.test(config)
          .then(() => {
            cs.settings.write(config).then(() =>
              $uibModalInstance.close()
            );
          })
          .catch(err => {
            log.error(err);

            $scope.$applyAsync(() => {
              $scope.wait = false;
              Notification.error('Veritabanına bağlanılamadı.');
            })
          })
      );
    }
  }

  angular.module('app')
    .controller('ConnectionController', [
      '$scope',
      '$timeout',
      '$uibModalInstance',
      'Notification',
      'ConnectionService',
      ConnectionController
    ]);
})();
