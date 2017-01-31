(function () {
  const app = angular.module('app', [
    'ui.bootstrap',
    'ui.router',
    'ngAnimate',
    'ui-notification'
  ]);

  function appRun($rootScope, ConnectionService) {
    $rootScope.close = function () {
      ipcRenderer.send("close");
    };

    $rootScope.showConnectionSettings = function () {
      ConnectionService.settings.show();
    }
  }

  app.run(['$rootScope', 'ConnectionService', appRun]);

  angular.element(document)
    .ready(function () {
      angular.bootstrap(document, ['app'], {
        strictDi: true
      });
    });
})();
