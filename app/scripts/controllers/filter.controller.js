(function () {
  'use strict';

  function FilterController($scope, $uibModalInstance) {
    $scope.currencies = [
      { type: 0, short: 'TRY', name: 'Türk Lirası' },      
      { type: 1, short: 'USD', name: 'ABD Doları' },
      { type: 20, short: 'EUR', name: 'Euro' }, 
      { type: 17, short: 'GBP', name: 'İngiliz Sterlini' },           
      { type: 14, short: 'CAD', name: 'Kanada Doları' },      
      { type: 3, short: 'AUD', name: 'Avustralya Doları' },
      { type: 13, short: 'JPY', name: 'Japon Yeni' },
      { type: 25, short: 'CNY', name: 'Çin Yüeni' },      
      { type: 15, short: 'KWD', name: 'Kuveyt Dinarı' },
      { type: 30, short: 'IQD', name: 'Irak Dinarı' }
    ];

    $scope.filter = function () {
      $uibModalInstance.close(
        _.pick(
          $scope,
          [
            'search',
            'clSpeCode',
            'invSpeCode',
            'onlyWithBalance',
            'onlyWithEmail',
            'useMinimumTotal',
            'minimumTotal',
            'useTrCurrency',
            'trCurrencyNr'
          ]
        )
      );
    }

    $scope.trCurrency = _.find($scope.currencies, { type: $scope.trCurrencyNr });

    $scope.selectTrCurrency = function (currency) {
      $scope.trCurrency = currency;
      $scope.trCurrencyNr = currency.type;
    };

    $scope.setTrCurrency = function () {
      if (!$scope.useTrCurrency) {
        $scope.trCurrencyNr = 0;
        $scope.trCurrency = _.find($scope.currencies, { type: 0 });
      }
    }

    $scope.setMinimumTotal = function () {
      if (!$scope.useMinimumTotal) {
        $scope.minimumTotal = 0;
      }
    }
  }

  angular.module('app').controller('FilterController', [
    '$scope',
    '$uibModalInstance',
    FilterController
  ]);
})();
