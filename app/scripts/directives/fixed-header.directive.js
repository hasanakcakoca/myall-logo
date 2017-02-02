(function () {
  'use strict';

  angular.module('app')
    .directive('fixedHeader', ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          $timeout(function () {
            const container = element.parentsUntil(attrs.fixedHeader);
            element.stickyTableHeaders({scrollableArea: container, "fixedOffset": 2});
          }, 0);
        }
      };
    }]);
})();
