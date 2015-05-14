---
layout: post
author: Alain ANDRE
title: "AngularJS, comment ça marche"
date: 2014-04-25 02:30:20 +0200
comments: true
categories: 
  - angularjs
tags :
  - angular
  - webapp
---

## Le concepte de base
L'attribut **ng-app** définit le bloc qui constitue l'application AngularJS et qui serra gérée par la directive **ngApp**.

```html 
<!-- Une application AngularJS -->
<html ng-app>
```

Les **attributs** sont constitués de mots séparés par des tirets et leurs **directives** liées sont constituées des mêmes mots au format camelcase.

Le script **angular.js** enregistre un callback dès le html chargé qui va rechercher la directive **ngApp**. S'il trouve la directive, il va démarrer l'application à partir du DOM sur lequel elle a été définie.

Le **binding** : il s'agit de demander à AngularJS de traiter ce qui se trouve entre les doubles accolades et de l'afficher à la place dans le code HTML.

## Les trois étapes de la liaison

  - Tout d'abord, l'**Injector** qui est utilisé pour l'injection des dépendances est créé.
  - L'**Injector** va créer le **root scope** qui deviendra le contexte pour le modèle de l'application.
  - Angular va finir par *compiler* le DOM à partir de la directive **ngApp** traitant les directives et liaisons trouvées au long du chemin.

Une fois la liaison établie, l'application va attendre les événements (mouse click, key press, HTTP entrant) provenants du navigateur qui pouraient modifier le model (root scope) en place. Si une modification doit être faite, AngularJS le reflétera dans la vue en mettant à jour toutes les liaisons (bindings) concernées.

## De la page statique au template.
AngularJS structure son code en MVC. Pour lui, une vue est la projection d'un model à travers un template HTML. Ce qui a pour effet qu'à chaque modification du model, AngularJS rafraichit les liaisons dans le code HTML.

Une application a donc au minimum la directive **ngApp** qui va définir l'application et créer l'injector.

```html 
<!-- L'application -->
<html lang="fr" ng-app="maSuperApp">
```

Ensuite il lui faut un controlleur définit par la directive **ngController** qui dans le code suivant lie un **controlleur UsersCtrl** au DOM pour ce bloc.

```html 
<!-- Le controlleur -->
<body ng-controller="UsersCtrl">
```

Il lui faut maintenant une vue qui contienne des éléments liés.
{% raw %}

```html 
<!-- La vue -->
<ul>
  <li ng-repeat="user in users">
    {{user.name}}
    <p>{{user.address}}</p>
  </li>
</ul>
```
{% endraw %}
Ici nous utilisons l'une des [directives](https://docs.angularjs.org/api/ng/directive) d'AngularJS **ngRepeat** qui prend en paramètre un tableau dans lequel on va itérer et afficher les attributs dans des éléments de liaison.

Et pour finir, nous devons fournir les données du model qui vont être instanciées par le controller.

```javascript 
// app/js/controller.js
var maSuperApp = angular.module('maSuperApp', []);

maSuperApp..controller('UsersCtrl', function ($scope) {
  $scope.users = [
    {'name': 'A. alain',
      'address': '3 rue du cerf'},
    {'name': 'G. henry',
      'address': '8 bd la peruque'}
  ];
});
```
**$scope** est vraiment crutial dans AngularJS, c'est ce qui va maintenir le liens entre la vue le modèle et le controlleur.

## Et maintenant on teste
AngularJS étant un framework moderne, il ne pouvait pas laisser de côté les testes et nous propose de faire ça simplement. Ici écrit en [jasmine](http://jasmine.github.io/).

```javascript 
// test/unit/controllersSpec.js
describe('UsersCtrl', function(){

  beforeEach(module('maSuperApp'));

  it('should create "users" model with 2 users', inject(function($controller) {
    var scope = {},
    ctrl = $controller('UsersCtrl', {$scope:scope});

    expect(scope.users.length).toBe(3);
  }));

});
```

## Passons à plus d'interaction
AngularJS permet de lier simplement un élément à un autre grâce à la directive [ngModel](https://docs.angularjs.org/api/ng/directive/ngModel)
{% raw %}

```html 
<!-- La vue -->
<div>
  Search: <input ng-model="query">
</div>
<ul>
  <li ng-repeat="user in users  | filter:query">
    {{user.name}}
    <p>{{user.address}}</p>
  </li>
</ul>
<textarea ng-model="query"></textarea>
```
{% endraw %}
Dans cette vue, ce que vous tapez dans la balise input va permettre de filtrer notre liste et va être écrit dans le textarea sans que nous aillons besoin de modifier du script.

## Faisons venir des données de notre serveur
Ici nous allons faire afficher les données venant d'un json et les trier par nom.

```javascript 
// app/js/controller.js
var maSuperApp = angular.module('maSuperApp', []);

maSuperApp.controller('UsersCtrl', function ($scope, $http) {
  $http.get('users/users.json').success(function(data) {
    $scope.users = data;
  });

  $scope.oByName = "name"
});
```
{% raw %}

```html 
<!-- La vue -->
<div>
  Search: <input ng-model="query">
</div>
<ul>
  <li ng-repeat="user in users  | filter:query | order:oByName">
    {{user.name}}
    <p>{{user.address}}</p>
  </li>
</ul>
```
{% endraw %}

**$http** est un des [services](https://docs.angularjs.org/api/ng/service/) d'AngularJS que l'on peut passer en arguement à un controlleur. Ici, il nous permet au chargement de l'application de récupérer les données de nos users.