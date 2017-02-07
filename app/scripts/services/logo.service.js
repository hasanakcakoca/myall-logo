(function () {
  'use strict';

  function LogoService(ConnectionService) {
    const cs = ConnectionService;

    return {
      util: {
        getQuery: function (file) {
          return jetpack.read(`${__dirname}/queries/${file}.sql`);
        }
      },
      getFirms: function () {
        return cs.query(this.util.getQuery('firms'));
      },
      getPeriod: function (firmNr) {
        return cs.query(this.util.getQuery('period'), {firmNr});
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
      'ConnectionService',
      LogoService
    ]);
})();
