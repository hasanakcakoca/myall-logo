(function () {
  'use strict';

  const DOMAIN = process.env.DOMAIN;
  const API_BASE = `${DOMAIN}/api`;

  function addInterceptor($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }

  function ApiService($rootScope, $http) {
    return {
      login: function (email, password) {
        return $http.post(`${DOMAIN}/auth/local`, {
          email,
          password
        })
          .then(res =>
            $rootScope.token = res.data.token
          );
      },
      import: function (data, preventRefresh) {
        return $http.post(
          `${API_BASE}/transactions/import`,
          {data, preventRefresh}
        );
      }
    };
  }

  angular.module('app')
    .factory('ApiService', ['$rootScope', '$http', ApiService])
    .config(['$httpProvider', addInterceptor]);
})();
