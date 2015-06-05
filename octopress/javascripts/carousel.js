---
---

/**
 * Connexions aux apis pour fournir les données du carousel
 */

mon_site.controller('CarouselCtrl', ['$scope', '$http', function ($scope, $http) {
  
  $http.get("https://api.github.com/users/{{site.github_user}}/repos?sort=pushed")
    .success(function(data) {
      $scope.githubs = data;
    });

    if(navigator.userAgent.indexOf('Firefox') != -1) $scope.isff = true;
    else $scope.isff = false;
}]);
