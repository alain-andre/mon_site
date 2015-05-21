---
---

var mon_site = angular.module('monSite', ['ui.bootstrap', 'ngAnimate', 'duScroll']);

mon_site.config([
  '$interpolateProvider', function($interpolateProvider) {
    return $interpolateProvider.startSymbol('[[').endSymbol(']]');
  }
]);

mon_site.controller('CarouselCtrl', ['$scope', '$animate', function ($scope, $animate) {
  $animate.enabled(true);
  $scope.myInterval = 10000;
}]);

mon_site.controller('BodyCtrl', ['$scope', '$sce', '$document', function ($scope, $sce, $document) {
  $scope.html_tooltip = $sce.trustAsHtml('Retourner en <b>haut</b> de page!');

  $scope.scroll_to_top = function(){
    $document.scrollTopAnimated(0, 1000);
  };
}]);

mon_site.controller('SearchCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('{{url}}/search.json').success(function(data) {
    $scope.articles = data.entries;
    $scope.ordre = "date";
  });
}]);

