(function () {
  'use strict';

  const {dialog} = remote;
  const alasql = require('alasql');

  function TransactionsController($scope,
                                  $rootScope,
                                  $timeout,
                                  $uibModal,
                                  Notification,
                                  LogoService) {
    $scope.forms = [
      {type: 1, name: 'Bakiye'},
      {type: 2, name: 'Form BA'},
      {type: 3, name: 'Form BS'}
    ];

    $scope.getDefaultOptions = function () {
      return {
        search: '',
        clSpeCode: '',
        invSpeCode: '',
        onlyWithBalance: true,
        onlyWithEmail: true
      }
    };

    $scope.filtered = function () {
      return !_.isMatch(
        $scope.options,
        $scope.getDefaultOptions()
      );
    };

    $scope.getFirms = function () {
      LogoService.getFirms().then(firms =>
        storage.getAsync('config')
          .then(config =>
            $scope.$applyAsync(() => {
              delete $scope.firm;

              $scope.firms = firms;
              $scope.options = $scope.getDefaultOptions();

              $scope.isEmpty = false;
              $scope.loaded = false;
              $scope.loading = false;

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
        $scope.loaded = false;
        $scope.loading = true;

        LogoService.getFirmInfo(config.firm.nr).then(result => {
          const limit = 5000;

          const firmInfo = _.head(result);

          const firmNr = ("000" + config.firm.nr).slice(-3);
          const periodNr = ("00" + firmInfo.periodNr).slice(-2);

          const currency = firmInfo.currency;

          const year = config.date.year;
          const month = config.date.month;

          const formType = config.form.type;

          const params = _.merge(config.options, {
            firmNr, periodNr, currency,
            formType, month, year, limit
          });

          let promise;

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
              $scope.loading = false;

              $timeout(() => {
                $scope.data = data;
                $scope.isEmpty = !data[0];
                $scope.count = data.length;

                $scope.loaded = true;
              });
            })
          ).catch(err => {
            console.log(err);

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
        scope: modalScope,
        backdrop: 'static',
        windowClass: 'modal-default',
        controller: 'FilterController',
        templateUrl: './templates/filter.html'
      });

      modalInstance.result.then(options =>
        $scope.options = options
      );
    };

    $scope.exportToExcel = function () {
      dialog.showSaveDialog({
        defaultPath: app.getPath('desktop'),
        filters: [{
          name: 'Çalışma Sayfası',
          extensions: ['xlsx']
        }]
      }, filename =>
        alasql.promise(
          `
            SELECT
              [Vergi No],
              [Ad],
              [Form Tipi],
              [Ay],
              [Yıl],
              [Adet],
              [Tutar],
              [Para Birimi],
              [Borç/Alacak],
              [E-Posta],
              [Telefon],
              [Faks],
              [İlgili Kişi]
            INTO
              XLSX('${filename}', {})
            FROM ?
          `,
          [$scope.data]
        ).then(() =>
          Notification.success('Excel aktarımı tamamlandı.')
        )
      );
    };

    $scope.exportToApp = function () {
      let modalScope = $rootScope.$new();

      angular.extend(modalScope, {data: $scope.data});

      $uibModal.open({
        scope: modalScope,
        backdrop: 'static',
        windowClass: 'modal-default',
        controller: 'ExportController',
        templateUrl: './templates/export.html'
      });
    };

    $scope.$watch('$root.connection', () => {
      $scope.loading = true;

      $rootScope.connection ?
        $scope.getFirms() :
        $rootScope.showConnectionSettings()
    });

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
        form: $scope.form,
        options: $scope.options
      }
    }, $scope.load, true);
  }

  angular.module('app').controller('TransactionsController', [
    '$scope',
    '$rootScope',
    '$timeout',
    '$uibModal',
    'Notification',
    'LogoService',
    TransactionsController
  ]);
})();
