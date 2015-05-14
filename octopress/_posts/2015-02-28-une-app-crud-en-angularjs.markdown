---
layout: post
author: Alain ANDRE
title: "Une application CRUD en AngularJS"
date: 2015-02-28 00:38:17 +0100
comments: true
published: true
categories: 
  - angularjs
tags :
  - angularjs
  - webapp
---

L'objectif est de créer une application AngularJS avec les opérations de stockage de données CRUD.


# Prérequis
Pour cela il faut utiliser le service `$resource` qui est disponible avec le JavaScript `angular-resource`. Il faut aussi que le module principal de l'application déclare une dépendance au module `ngResource`.

```javascript
angular.module("myapp", ['ngResource']);
```

Il faut aussi un serveur [RESTful](/blog/2015/02/02/une-api-avec-grape/) de votre choix.

# La mise en place
## L'ajout d'un service
L'objectif est de définir un service qui va retourner les cinq fonctions suivantes `get()`, `query()`, `save()`, `remove()` et `delete()` via l'objet `$resource` auquel on a passé l'url pour l'objet que l'on souhaite. Ici `Phone` va devenir un objet accessible dans notre contrôleur.

```javascript 
// app/assets/javascripts/service.js
angular.module('myApp.services').factory('Phone', ['$resource',
  function($resource){
    return $resource('api/v1/phones/:id', { id: '@_id' }, {
      update: { method: 'PUT' }
    });
  }]);
```

On définit `{ id: '@_id' }` afin d'utiliser l'`_id` de l'instance en cours de la *$resource*. C'est très pratique pour les *update* ou *delete*.

## Le paramétrage des routes
Il nous reste à paramétrer les routes pour cet objet Phone.

```javascript 
// app/assets/javascripts/routes.js
$stateProvider.state('phones', { // state for showing all phones
  url: '/phones',
  templateUrl: 'phones/index.html',
  controller: 'PhoneListController'
}).state('viewPhone', { //state for showing single Phone
  url: '/phones/:id/view',
  templateUrl: 'phones/show.html',
  controller: 'PhoneViewController'
}).state('newPhone', { //state for adding a new Phone
  url: '/phones/new',
  templateUrl: 'phones/new.html',
  controller: 'PhoneCreateController'
}).state('editPhone', { //state for updating a Phone
  url: '/phones/:id/edit',
  templateUrl: 'phones/edit.html',
  controller: 'PhoneEditController'
});
```

## Le contrôleur
Il est maintenant possible de définir les fonctions accessibles via le `$scope` de l'application dans chacun des contrôleurs liés à notre objet `Phone`.

```javascript 
// app/assets/javascripts/controller.js
angular.module('myApp.controllers').controller('PhoneListCtrl', function($scope, $state, $window, Phone) {
  $scope.phones = Phone.query(); //fetch all phones. Issues a GET to /api/phones
 
  $scope.deletePhone = function(phone) { // Delete a phone. Issues a DELETE to /api/phones/:id
    if ($window.confirm('Really delete this?')) {
      phone.$delete(function() {
        $window.location.href = ''; //redirect to home
      });
    }
  };
})
.controller('PhoneViewCtrl', function($scope, $stateParams, Phone) {
  $scope.phone = Phone.get({ id: $stateParams.id }); //Get a single phone.Issues a GET to /api/phones/:id
})
.controller('PhoneCreateCtrl', function($scope, $state, $stateParams, Phone) {
  $scope.phone = new Phone();  //create new phone instance. Properties will be set via ng-model on UI
 
  $scope.addPhone = function() { //create a new phone. Issues a POST to /api/phones
    $scope.phone.$save(function() {
      $state.go('phones'); // on success go back to home i.e. phones state.
    });
  };
})
.controller('PhoneEditCtrl', function($scope, $state, $stateParams, Phone) {
  $scope.updatePhone = function() { //Update the edited phone. Issues a PUT to /api/phones/:id
    $scope.phone.$update(function() {
      $state.go('phones'); // on success go back to home i.e. phones state.
    });
  };
 
  $scope.loadPhone = function() { //Issues a GET request to /api/phones/:id to get a phone to update
    $scope.phone = Phone.get({ id: $stateParams.id });
  };
 
  $scope.loadPhone(); // Load a phone which can be edited on UI
});
```

# L'utilisation
Tout étant prêts, il reste à écrire les templates qui les appelleront en utilisant les `ng-submit` pour les formulaires et les `ui-sref` et `ng-click` pour les boutons. `ui-sref` va être utilisé pour faire un appel aux routes; pour l'édition, on va donc faire appel au *state* `editPhone` qui va afficher le template d'édition.

```html
<form ng-submit="addPhone()" ></form>
<form ng-submit="updatePhone()" ></form>
<a ui-sref="editPhone({id:phone._id})">Edit</a>
<a ui-sref="viewPhone({id:phone._id})">View</a>
<a ng-click="deletePhone(phone)">Delete</a>
```

# Sources
* [angularjs.org](https://docs.angularjs.org/tutorial/step_11)
* [http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/](http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/)
