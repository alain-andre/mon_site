---
layout: post
author: Alain ANDRE
title: "Intégrer BrowserId à une app. Rails/AngularJs"
date: 2015-04-06 17:50:48 +0200
comments: true
published: true
categories: 
  - angularjs
  - Ruby on Rails
tags :
  - angularjs
  - webapp
  - browserid
---

Afin d'identifier les utilisateurs, nous allons utiliser la gem [devise browserid authenticatable](https://github.com/denschub/devise_browserid_authenticatable) qui va nous permettre d'utiliser [BrowserId](https://login.persona.org/about). 

# Installation et configuration
Il faut ajouter la ligne suivante au Gemfile : `gem "devise_browserid_authenticatable"`

Une fois le `bundle` mis à jour, il faut générer l'`initializer`

```bash
rails generate browser_id:install.
```

Pour activer la stratégie de garde, il faut ajouter les lignes suivantes dans devise.rb : 

```ruby 
# config/initializers/devise.rb
config.warden do |manager|
  manager.default_strategies(:scope => :user).unshift :browserid_authenticatable
end
```

# Mise en place
Il faut commencer par ajouter dans le header du layout de l'application le helper de vue suivant : 

```ruby
<%= browserid_js_tag %>
```

Le bouton de connexion ressemble à ceci : 

```haml
div ng-controller="MyController"
  = link_to (image_tag "persona-button.png", :class => "persona-login-button", "ng-click" => "myData.doClick(item, $event)"), '#'
```

Le fichier CoffeeScript suivant permet lors du clic sur le bouton `.persona-login-button` de lancer [navigator.id.get-function](https://developer.mozilla.org/en-US/docs/DOM/navigator.id.get) pour obtenir l'assertion de BrowserID puis de l'envoyer par ajax à l'url d'identification de l'application. 

Il est aussi possible de passer en paramètre à `navigator.id.get` le `privacyPolicy`, `termsOfService `, `siteLogo` et le `siteName`. Une fois l'identification faite, le script charge la page d’accueil (root-path).

```javascript 
// add_browserid_to_controller.js.coffee
angular.module("myapp", []).controller "MyController", ($scope, $http) ->
    $scope.myData = {};
    $scope.myData.doClick = (item, event) ->
        navigator.id.get (assertion) ->
            if (assertion)
                responsePromise = $http.post("/users/sign_in", {"assertion": assertion}, {cache: false});
                responsePromise.success (data, status, headers, config) ->
                    window.location.href = '/';
                responsePromise.error (data, status, headers, config) ->
                    alert("AJAX failed!");
```

# Note
Le Firefox Marketplace utilise désormais les [comptes Firefox](https://support.mozilla.org/en-US/kb/use-firefox-accounts-manage-your-marketplace-apps) afin d'identifier les appareils, les navigateurs (desktop, mobile) de façon plus simple.
