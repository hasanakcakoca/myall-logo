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

    $scope.getFirms = function () {
      LogoService.getFirms().then(firms =>
        $scope.$applyAsync(() => {
          delete $scope.firm;
          $scope.firms = firms;
          $scope.loaded = false;
        })
      );
    };

    $scope.selectFirm = function (firm) {
      $scope.firm = firm;
    };

    $scope.selectDate = function (date) {
      $scope.selectedDate = date;
    };

    $scope.selectForm = function (form) {
      $scope.form = form;
    };

    $scope.load = function (params) {
      if (params.firm && params.date && params.form) {
        LogoService.getPeriod(params.firm.nr).then(result => {
          const limit = 5000;

          const period = _.head(result);

          const firmNr = ("000" + params.firm.nr).slice(-3);
          const periodNr = ("00" + period.nr).slice(-2);

          const year = params.date.year;
          const month = params.date.month;

          const formType = params.form.type;

          const filter = {firmNr, periodNr, formType, month, year, limit};

          let promise;

          $scope.loaded = false;
          $scope.loading = true;

          switch (formType) {
            case 1: promise = LogoService.getBalance(filter);
            break;
            case 2: promise = LogoService.getFormBA(filter);
            break;
            default: promise = LogoService.getFormBS(filter);
          }

          promise.then(data =>
            $scope.$applyAsync(() => {
              $scope.loaded = true;
              $scope.loading = false;

              $scope.isEmpty = !data[0];
              $scope.count = data.length;
            })
          ).catch(() => {
            $scope.isEmpty = true;
            $scope.loading = false;
          });
        });
      }
    };

    $scope.$watch('$root.connection', () =>
      $rootScope.connection ?
        $scope.getFirms() :
        $rootScope.showConnectionSettings()
    );

    $scope.$watch('selectedDate', date => {
      if (!date) return;

      const m = moment(date, 'MMMM YYYY');

      const year = m.year();
      const month = m.month() + 1;

      $scope.date = {month, year};
    });

    $scope.$watch(() => {
      return {
        firm: $scope.firm,
        date: $scope.date,
        form: $scope.form
      }
    }, $scope.load, true);
  }

  angular.module('app').controller('TransactionsController', [
    '$scope',
    '$rootScope',
    'LogoService',
    TransactionsController
  ]);
})();
