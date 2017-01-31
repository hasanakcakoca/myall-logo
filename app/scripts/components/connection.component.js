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
            cs.settings.write(config);
            $uibModalInstance.dismiss('ok');
          })
          .catch(err => {
            console.log(err);

            $scope.$applyAsync(() => {
              $scope.wait = false;
              Notification.error('Veritabanına bağlanılamadı.');
            });
          })
      );
    }
  }

  function ConnectionService($rootScope, $uibModal) {
    return {
      test: function (config) {
        let connection = new sql.Connection(config);

        return connection.connect().then(() =>
          connection.close()
        );
      },
      connect: function () {
        return this.read().then(config =>
          new sql.Connection(config)
        );
      },
      settings: {
        show: function () {
          return this.read().then(config => {
            let modalScope = $rootScope.$new();

            angular.extend(modalScope, config);

            $uibModal.open({
              scope: modalScope,
              backdrop: 'static',
              windowClass: 'modal-default',
              controller: 'ConnectionController',
              templateUrl: './templates/connection.html'
            });
          });
        },
        read: function () {
          return storage.getAsync('connection')
            .then(config => encryptor.decrypt(config));
        },
        write: function (config) {
          return storage.setAsync('connection', encryptor.encrypt(config));
        }
      }
    }
  }

  angular.module('app')
    .factory('ConnectionService', [
      '$rootScope',
      '$uibModal',
      ConnectionService
    ])
    .controller('ConnectionController', [
      '$scope',
      '$timeout',
      '$uibModalInstance',
      'Notification',
      'ConnectionService',
      ConnectionController
    ]);
})();
