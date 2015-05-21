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

}]);
