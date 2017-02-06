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
      getBalance: function (filter) {
        return cs.query(this.util.getQuery('balance'), filter);
      },
      getFormBA: function (filter) {
        return cs.query(this.util.getQuery('form-ba'), filter);
      },
      getFormBS: function (filter) {
        return cs.query(this.util.getQuery('form-bs'), filter);
      }
    };
  }

  angular.module('app')
    .factory('LogoService', [
      'ConnectionService',
      LogoService
    ]);
})();
