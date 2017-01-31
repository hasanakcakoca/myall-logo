(function () {
  'use strict';

  function LoginController($scope, $uibModalInstance, Notification, ApiService) {
    cookies.getCookie('email')
      .then(email => {
        $scope.email = email;

        if (email) {
          $scope.focusPassword = true;
        }
      });

    $scope.login = function (form) {
      if (!form.$valid) return;

      $scope.wait = true;

      ApiService.login($scope.email, $scope.password)
        .then(() => {
          cookies.setCookie('email', $scope.email);
          $uibModalInstance.close();
        })
        .catch(err =>
          $scope.$applyAsync(() => {
            $scope.wait = false;
            Notification.error('Kullanıcı girişi yapılamadı.');
          })
        );
    }
  }

  angular.module('app').controller('LoginController', [
    '$scope',
    '$uibModalInstance',
    'Notification',
    'ApiService',
    LoginController
  ]);
})();
