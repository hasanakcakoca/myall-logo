(function () {
  'use strict';

  function TransactionsController($scope,
                                  $rootScope,
                                  LogoService) {
    $scope.forms = [
      {type: 1, name: 'Bakiye'},
      {type: 2, name: 'Form BA'},
      {type: 3, name: 'Form BS'}
    ];

    $scope.checkboxes = {
      checked: false,
      items: {}
    };

    $scope.getFirms = function () {
      LogoService.getFirms().then(firms =>
        $scope.$applyAsync(() => {
          delete $scope.firm;
          $scope.firms = firms;
        })
      );
    };

    $scope.selectFirm = function (firm) {
      $scope.firm = firm;

      LogoService.getPeriod(firm.NR).then(period => {
        $scope.period = _.head(period);
      });
    };

    $scope.selectForm = function (form) {
      $scope.form = form;
    };

    $scope.$watch('$root.connection', () =>
      $rootScope.connection ?
        $scope.getFirms() :
        $rootScope.showConnectionSettings()
    );
  }

  angular.module('app').controller('TransactionsController', [
    '$scope',
    '$rootScope',
    'LogoService',
    TransactionsController
  ]);
})();
