(function () {
  function appConfig($httpProvider,
                     $stateProvider,
                     $urlRouterProvider,
                     $qProvider,
                     momentPickerProvider,
                     NotificationProvider) {
    $qProvider.errorOnUnhandledRejections(false);

    momentPickerProvider.options({
      locale: 'tr'
    });

    NotificationProvider.setOptions({
      delay: 2000,
      positionX: 'center',
      closeOnClick: false,
      scrollButtons: {
       enable: false
      }
    });

    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/');

    $stateProvider.state({
      name: 'main',
      url: '/',
      controller: 'MainController',
      templateUrl: './templates/main.html'
    }).state({
      name: 'transactions',
      url: '/cariler',
      controller: 'TransactionsController',
      templateUrl: './templates/transactions.html'
    });
  }

  angular.module('app')
    .config([
      '$httpProvider',
      '$stateProvider',
      '$urlRouterProvider',
      '$qProvider',
      'momentPickerProvider',
      'NotificationProvider',
      appConfig
    ]);
})();
