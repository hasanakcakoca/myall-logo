(function () {
  function appConfig($stateProvider,
                     $urlRouterProvider,
                     $qProvider,
                     momentPickerProvider,
                     NotificationProvider,
                     ScrollBarsProvider) {
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

    ScrollBarsProvider.defaults = {
      scrollInertia: 400,
      axis: 'yx',
      theme: 'minimal-dark',
      autoHideScrollbar: true
    };

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
      '$stateProvider',
      '$urlRouterProvider',
      '$qProvider',
      'momentPickerProvider',
      'NotificationProvider',
      'ScrollBarsProvider',
      appConfig
    ]);
})();
