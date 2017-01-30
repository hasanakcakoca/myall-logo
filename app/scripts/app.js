(function () {
  const app = angular.module('app', [
    'ui.bootstrap',
    'ui.router',
    'ngAnimate',
    'ui-notification'
  ]);

  function appConfig($stateProvider, $qProvider, NotificationProvider) {
    $stateProvider.state({
      name: 'main',
      url: '/',
      controller: 'MainController',
      controllerAs: 'vm',
      templateUrl: './templates/main.html'
    });

    $qProvider.errorOnUnhandledRejections(false);

    NotificationProvider.setOptions({
      delay: 2000,
      positionX: 'center',
      closeOnClick: false
    });
  }

  function appRun($rootScope, ConnectionService) {
    $rootScope.close = function () {
      ipcRenderer.send("close");
    };

    $rootScope.showConnectionSettings = function () {
      ConnectionService.settings.show();
    }
  }

  app
    .config([
      '$stateProvider',
      '$qProvider',
      'NotificationProvider',
      appConfig
    ])
    .run([
      '$rootScope',
      'ConnectionService',
      appRun
    ]);

  angular.element(document)
    .ready(function () {
      angular.bootstrap(document, ['app'], {
        strictDi: true
      });
    });
})();
