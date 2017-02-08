(function () {
  'use strict';

  function LogoService(ConnectionService) {
    const cs = ConnectionService;

    return {
      util: {
        getQuery: function (file) {
          return fs.readFileSync(`${__dirname}/queries/${file}.sql`, 'utf8');
        }
      },
      getFirms: function () {
        return cs.query(this.util.getQuery('firms'));
      },
      getFirmInfo: function (firmNr) {
        return cs.query(this.util.getQuery('firm-info'), {firmNr});
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
