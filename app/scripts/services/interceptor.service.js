(function () {
  'use strict';

  function authInterceptor($rootScope, $q, $injector) {
    let state;
    let httpRequests = 0;

    function updateHttpRequest(inc) {
      inc ?
        httpRequests++ :
        httpRequests--;

      if (httpRequests < 0) {
        httpRequests = 0;
      }

      $rootScope.waitingForHttp = inc || (httpRequests !== 0);
    }

    return {
      request(config) {
        config.headers = config.headers || {};

        if (!config.noWaitForHttp) {
          updateHttpRequest(true);
        }

        if($rootScope.token) {
          config.headers.Authorization = `Bearer ${$rootScope.token}`;
        }

        return config;
      },

      requestError: function (error) {
        updateHttpRequest();
        return $q.reject(error);
      },

      response: function (response) {
        updateHttpRequest();
        return response;
      },

      responseError(error) {
        updateHttpRequest();

        if(error.status === 401) {
          (state || (state = $injector.get('$state')))
            .go('main');

          delete $rootScope.token;
        }

        return $q.reject(error);
      }
    };
  }

  angular.module('app')
    .factory('authInterceptor', [
      '$rootScope',
      '$q',
      '$injector',
      authInterceptor
    ]);
})();
