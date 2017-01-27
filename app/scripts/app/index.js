(function () {
  var app = angular.module('app', ['ui.bootstrap', 'ui.router']);

  app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state({
      name: 'main',
      url: '/',
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
