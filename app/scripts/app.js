(function () {
  const app = angular.module('app', ['ui.bootstrap', 'ui.router', 'ngAnimate']);

  app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state({
      name: 'main',
      url: '/',
      controller: 'MainController',
      controllerAs: 'vm',
      templateUrl: './templates/main.html'
    });
  }]);

  app.run(['$rootScope', function ($rootScope) {
    $rootScope.close = function () {
      ipcRenderer.send("close");
    };
  }]);

  angular.element(document)
    .ready(function () {
      angular.bootstrap(document, ['app'], {
        strictDi: true
      });
    });
})();
