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
      }
    };
  }

  angular.module('app')
    .factory('LogoService', [
      'ConnectionService',
      LogoService
    ]);
})();
