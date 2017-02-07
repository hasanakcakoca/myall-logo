(function () {
  'use strict';

  function TransactionsController($scope,
                                  $rootScope,
                                  $timeout,
                                  $uibModal,
                                  LogoService) {
    $scope.options = {};
    $scope.orgData = [];

    $scope.forms = [
      {type: 1, name: 'Bakiye'},
      {type: 2, name: 'Form BA'},
      {type: 3, name: 'Form BS'}
    ];

    $scope.getFirms = function () {
      LogoService.getFirms().then(firms =>
        storage.getAsync('config')
          .then(config =>
            $scope.$applyAsync(() => {
              delete $scope.firm;

              $scope.firms = firms;
              $scope.isEmpty = false;
              $scope.loaded = false;

              if (config) {
                $scope.form = config.form;
                $scope.firm = _.find($scope.firms, {nr: config.firm.nr});

                $scope.selectedDate = moment({
                  year: config.date.year,
                  month: config.date.month - 1
                });
              }
            })
          )
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

    $scope.load = function (config) {
      if (config.firm && config.date && config.form) {
        LogoService.getPeriod(config.firm.nr).then(result => {
          const limit = 5000;

          const period = _.head(result);

          const firmNr = ("000" + config.firm.nr).slice(-3);
          const periodNr = ("00" + period.nr).slice(-2);

          const year = config.date.year;
          const month = config.date.month;

          const formType = config.form.type;

          const params = {firmNr, periodNr, formType, month, year, limit};

          let promise;

          $scope.loaded = false;
          $scope.loading = true;

          storage.setAsync('config', config);

          switch (formType) {
            case 1:
              promise = LogoService.getBalance(params);
              break;
            case 2:
              promise = LogoService.getFormBA(params);
              break;
            default:
              promise = LogoService.getFormBS(params);
          }

          promise.then(data =>
            $scope.$applyAsync(() => {
              console.log(data);

              $scope.loading = false;

              $timeout(() => {
                $scope.options = {};
                $scope.orgData = angular.copy(data);

                $scope.isEmpty = !data[0];
                $scope.count = data.length;

                $scope.loaded = true;
              });
            })
          ).catch(() => {
            $scope.loading = false;
            $scope.isEmpty = true;
          });
        });
      }
    };

    $scope.filter = function () {
      let modalScope = $rootScope.$new();

      angular.extend(modalScope, $scope.options);

      const modalInstance = $uibModal.open({
        backdrop: 'static',
        windowClass: 'modal-default',
        controller: 'FilterController',
        templateUrl: './templates/filter.html'
      });

      modalInstance.result.then(() => alert(''));
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
    '$timeout',
    '$uibModal',
    'LogoService',
    TransactionsController
  ]);
})();
