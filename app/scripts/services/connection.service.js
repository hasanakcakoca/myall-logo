(function () {
  'use strict';

  const sql = require('mssql');

  function ConnectionService($rootScope, $uibModal) {
    return {
      test: function (config) {
        let connection = new sql.Connection(config);

        return connection.connect().then(() =>
          connection.close()
        );
      },
      connect: function () {
        return this.settings.read().then(config =>
          config ? new sql.Connection(config).connect() : null
        );
      },
      query: function (expression, iParams) {
        const request = new sql.Request($rootScope.connection);

        _.forEach(iParams, (value, key) =>
          request.input(key, value)
        );

        return request.query(expression);
      },
      settings: {
        show: function () {
          return this.read().then(config => {
            let modalScope = $rootScope.$new();

            angular.extend(modalScope, config);

            return $uibModal.open({
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
    };
  }

  angular.module('app')
    .factory('ConnectionService', [
      '$rootScope',
      '$uibModal',
      ConnectionService
    ]);
})();
