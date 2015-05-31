---
layout: post
author: Alain ANDRE
title: "Les templates angularjs sous rails"
date: 2014-05-17 10:24:25 +0200
comments: true
categories:
  - angularjs
tags :
  - angular
  - webapp
---

L'idée est d'utiliser **assets** afin de charger les templates qui peuvent être générés avec des données serveur. Il est alors possible d'utiliser HAML, ERB pour écrire nos templates. Une fois l'application chargée, tout serra disponible grâce à assets.

Nous allons ici créer un contrôleur de Livres qui permet de les lister et en afficher la page de modification.

Cet article ne porte que sur la façon d'architecturer son application; elle ne porte pas sur la création de formulaire, l'enregistrement de données, le thème ou encore l'identification. Je veux rester très simple dans cet exemple afin de pouvoir l'appliquer à une application plus complexe.

# Prérequis
Il faut tout d'abord une application rails basique.

```bash
rails _4.0.0_ new angular_template --skip-javascript
```

On y ajoute la gem `angularjs-rails` et `haml`

```ruby 
# Gemfile
gem 'angularjs-rails', '~> 1.2.16'
gem 'haml'
```

On crée un contrôleur **home** avec sa méthode **index**.

```bash
rails g controller home index --skip-assets
```

Le fichier route est très simple :

```ruby 
# config/routes.rb
root 'home#index'
```

# La structure

```bash 
# ls app/assets/
-javascripts
  |-controllers (lieu des contrôleurs)
  |-init.js (Création des modules et de l'application)
  |-applications.js (Définition des routes)
-templates (lieu des templates)
```

# La création d'un contrôleur
## Création des modules dans init.js

```javascript 
// app/assets/javascripts/init.js
// modules pour les contrôleurs
var livresModuleControllers = angular.module('livresModuleControllers', []);

// Création de l'application
var maSuperApp = angular.module('maSuperApp', ['ngRoute',
  'livresModuleControllers'
]);
```

## Création du contrôleur Livres

```javascript 
// app/assets/javascripts/controllers/livres.js
/**
 * Contrôleurs dans le module livresModuleControllers
 */

// Affiche la liste des livres
livresModuleControllers.controller('LivresController', ['$scope', '$http',
  function($scope, $http){
    // Liste des Livres
    /*$http.get('livres/list.json').success(function(data) {
      $scope.Livres = data;
    });*/
    $scope.livres = [
      {'id': '1',
        'name': 'Livre 1',
        'detail': 'bla bla bla'},
      {'id': '2',
        'name': 'Livre 2',
        'detail': 'bla bla bla'}
    ];
  }
]);

// Affiche le detail d'un livre dont l'id est passé dans l'url (#/livres/1)
livresModuleControllers.controller('LivresDetailController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http){
    /*$http.get('livres/' + $routeParams.livreId + '.json').success(function(data) {
      $scope.livre = data;
    });*/
    $scope.livre = {
      'id': $routeParams.livreId,
      'name': 'Livre '+$routeParams.livreId,
      'detail': 'blablabla'
    }
  }
]);
```

## Création des templates
Le template appelé pour lister les livres.

```ruby 
# app/assets/templates/livres/index.html.haml
%h4 Liste des livres

%div
  %a{href: "#/livres/:new"} Nouveau Livre

%ul
  %li{"ng-repeat "=> "livre in livres"}
    %a{href: "#/livres/{{livre.id}}"} {{livre.name}}
    %p {{livre.detail}}
```

Le template appelé pour afficher les détails d'un livre.

```ruby 
# app/assets/templates/livres/livre-detail.html.haml
%h4 Informations

%div
  %a{'href' => '#/livres'} Livres

%div
  %label Nom du livre
  %input{'ng-model' => 'livre.name'}

%div
  %label Détail du livre
  %textarea{'ng-model' => 'livre.detail'}
```

## Ajout des routes
Dans `app/assets/javascripts/application.js` il faut ajouter les appels aux script (à noter le **init** avant l'arborescence) et définir les routes.

```javascript
//= require angular
//= require angular-route
//= require turbolinks
//= require init
//= require_tree .

/**
 * Définition des routes
 */
maSuperApp.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/livres', {
        templateUrl: 'assets/livres/index.html',
        controller: 'LivresController'
      }).
      when('/livres/:livreId', {
        templateUrl: 'assets/livres/livre-detail.html',
        controller: 'LivresDetailController'
      }).
      otherwise({
        redirectTo: '/livres'
      });
  }
]);
```

## Modification des vues

On ajoute la directive **ngApp** au layout application.

```html 
<!-- app/views/layouts/application.html.erb -->
<!DOCTYPE html>
<html lang="fr" ng-app="maSuperApp">
<head>
  <title>AngularTemplate</title>
  <%= stylesheet_link_tag    "application", media: "all", "data-turbolinks-track" => true %>
  <%= javascript_include_tag "application", "data-turbolinks-track" => true %>
  <%= csrf_meta_tags %>
</head>
<body>

<%= yield %>

</body>
</html>
```

Et on modifie la page home/index de façon à ce qu'elle accueille les templates AngularJS.

```html 
<!-- app/views/home/index.html.erb -->
<div ng-view></div>
```

## Tout ne va pas marcher comme ça
Maintenant il faut dire à rails que ce qui se trouve dans assets/templates doit être ajouté à **assets**.

```ruby 
# config/application.rb
require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module AngularTemplate
  class Application < Rails::Application

    config.assets.paths << Rails.root.join('app', 'assets', 'templates')
  end
end
```

Nos templates s'affichent (si vous ajoutez **.haml** aux **templateUrl**, ils s'afficheront) mais le **HAML** n'est pas interprété. Pour cela il faut enregistrer un engin qui peut interpréter le HAML dans assets.

```ruby 
# config/initializers/haml.rb
Rails.application.assets.register_engine '.haml', Tilt::HamlTemplate
```

Voilà !! Maintenant il est possible de créer des helpers, utiliser erb, haml, i18n etc. dans vos templates AngularJS.
