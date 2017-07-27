(function () {
  'use strict';

  function LogoService($rootScope, ConnectionService) {
    const cs = ConnectionService;

    return {
      util: {
        getQuery: function (file, forAccounting = true) {
          let acc = forAccounting && $rootScope.config.forAccounting ? '-acc' : '';
          return fs.readFileSync(`${__dirname}/queries/${file}${acc}.sql`, 'utf8');
        }
      },
      getFirms: function () {
        return cs.query(this.util.getQuery('firms', false));
      },
      getFirmInfo: function (firmNr) {
        return cs.query(this.util.getQuery('firm-info', false), {firmNr});
      },
      getBalance: function (params) {
        return cs.query(this.util.getQuery('balance'), params);
      },
      getFormBA: function (params) {
        return cs.query(this.util.getQuery('form-ba'), params);
      },
      getFormBS: function (params) {
        return cs.query(this.util.getQuery('form-bs'), params);
      }
    };
  }

  angular.module('app')
    .factory('LogoService', [
      '$rootScope',
      'ConnectionService',
      LogoService
    ]);
})();
