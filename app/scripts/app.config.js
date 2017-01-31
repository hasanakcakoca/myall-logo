(function () {
  function appConfig($stateProvider, $urlRouterProvider, $qProvider, NotificationProvider) {
    $qProvider.errorOnUnhandledRejections(false);

    NotificationProvider.setOptions({
      delay: 2000,
      positionX: 'center',
      closeOnClick: false
    });

    $urlRouterProvider.when('', '/main');
    $urlRouterProvider.otherwise('/main');

    $stateProvider.state({
      name: 'main',
      url: '/',
      controller: 'MainController',
      templateUrl: './templates/main.html'
    }).state({
      name: 'transactions',
      url: 'cariler',
      controller: 'TransactionsController',
      templateUrl: './templates/transactions.html'
    });
  }

  angular.module('app')
    .config([
      '$stateProvider',
      '$urlRouterProvider',
      '$qProvider',
      'NotificationProvider',
      appConfig
    ]);
})();
