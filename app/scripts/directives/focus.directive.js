(function () {
  'use strict';

  angular.module('app')
    .directive('ngFocus', ['$timeout', ($timeout) => {
      return {
        link: (scope, element, attrs) => {
          scope.$watch(attrs.ngFocus, (val) => {
            if (angular.isDefined(val) && val) {
              $timeout(() => element[0].focus());
            }
          }, true);
        }
      };
    }]);
})();
