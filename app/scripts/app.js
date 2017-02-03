(function () {
  const app = angular.module('app', [
    'ui.bootstrap',
    'ui.router',
    'ngAnimate',
    'ui-notification',
    'moment-picker',
    'ngScrollbars'
  ]);

  function appRun($rootScope, ConnectionService) {
    $rootScope.close = function () {
      ipcRenderer.send('close');
    };

    $rootScope.connect = function (cb = angular.noop) {
      ConnectionService.connect().then(connection => {
        if ($rootScope.connection) {
          $rootScope.connection.close();
        }

        cb($rootScope.connection = connection);
      });
    };

    $rootScope.showConnectionSettings = function (cb) {
      ConnectionService.settings.show()
        .then(modalInstance =>
          modalInstance.result
            .then(() => $rootScope.connect(cb))
        );
    };

    $rootScope.connect();
  }

  app.run(['$rootScope', 'ConnectionService', appRun]);

  angular.element(document)
    .ready(function () {
      angular.bootstrap(document, ['app'], {
        strictDi: true
      });
    });
})();
