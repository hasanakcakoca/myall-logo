(function () {
  'use strict';

  function TransactionsController(
    $scope,
    $rootScope,
    $timeout,
    $http,
    NgTableParams,
    LogoService
  ) {
    $scope.forms = [{
      type: 1,
      name: 'Bakiye'
    }, {
      type: 2,
      name: 'Form BA'
    }, {
      type: 3,
      name: 'Form BS'
    }];

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

    $timeout(() => {
      $http.get('./data/sample.json').then(result => {
        $scope.data = result.data;

        $scope.tableParams = new NgTableParams(
          {count: $scope.data.length},
          {dataset: $scope.data}
        );

        $scope.$watch(() => $scope.checkboxes.checked, value =>
          angular.forEach($scope.data, item =>
            $scope.checkboxes.items[item.id] = value
          )
        );

        $scope.$watch(() => $scope.checkboxes.items, values => {
          let checked = 0,
            unchecked = 0,
            total = $scope.data.length;

          angular.forEach($scope.data, item => {
            checked +=  ($scope.checkboxes.items[item.id]) || 0;
            unchecked += (!$scope.checkboxes.items[item.id]) || 0;
          });

          if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
          }

          angular.element(
            $element[0]
              .getElementsByClassName('select-all'))
              .prop('indeterminate', (checked != 0 && unchecked != 0)
          );
        }, true);
      });

      $scope.$watch('$root.connection', () =>
        $rootScope.connection ?
          $scope.getFirms() :
          $rootScope.showConnectionSettings()
      );
    });
  }

  angular.module('app').controller('TransactionsController', [
    '$scope',
    '$rootScope',
    '$timeout',
    '$http',
    'NgTableParams',
    'LogoService',
    TransactionsController
  ]);
})();
