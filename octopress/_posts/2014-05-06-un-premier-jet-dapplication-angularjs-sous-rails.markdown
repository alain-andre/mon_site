---
layout: post
author: Alain ANDRE
title: "Un premier jet d'application angularjs sous rails"
date: 2014-05-06 01:51:39 +0200
comments: true
categories: 
  - Ruby on Rails
  - angularjs
tags:
  - angularjs
  - webapp
  - rails
---

## Objectif
Il s'agit de mettre en place une application hebergée basique utilisant AngularJS sur un socle Rails. Cette application a pour objectif de gérer des livres : On peut les lister et en ajouter.
 - Version Ruby : 2.0.0
 - Version Rails : 4.0.0

## Mise en place
### Iteration 1
Il s'agit d'une application herbergée, mais il faut tout de même créer son manifest.

Pour cela, il faut commencer par ajouter à config/initializers/mime_types.rb

```ruby 
# config/initializers/mime_types.rb
Mime::Type.register "application/x-web-app-manifest+json", :webapp
```

Et on peut créer notre manifest.

```javascript 
// public/manifest.webapp
{
  "version": "0.1",
  "name": "AngularJS Rails",
  "description": "Une super appli web en angularjs et rails",
  "launch_path": "/livres/index.html",
  "icons": {
    "16": "/assets/app-icons/icon-16.png",
    "48": "/assets/app-icons/icon-48.png",
    "128": "/assets/app-icons/icon-128.png"
  },
  "developer": {
    "name": "Alain ANDRE",
    "url": "http://alain-andre.fr"
  },
  "locales": {
    "en": {
      "description": "A super web app made in angularjs and rails",
      "developer": {
        "url": "http://alain-andre.fr/en"
      }
    }
  },
  "default_locale": "fr"
}
```

### Iteration 2
La construction du model principal de notre application : le livre. Il est constitué d'un label, une description, une image et un prix. Je ne vais pas couvrir ici l'upload de l'image.

```bash 
# Création du model Livre
rails g model livre label:string description:text image:string price:decimal
```

On améliore les informations du model.

```ruby 
# app/models/livre.rb
class Livre < ActiveRecord::Base
  validates_presence_of :label
  validates_uniqueness_of :label
  validates_numericality_of :price, :greater_than_or_equal_to => 0.01
end
```

On améliore aussi la migration.

```ruby 
# db/migrate/*_create_livres.rb
class CreateLivres < ActiveRecord::Migration
  def change
    create_table :livres do |t|
      t.string :label
      t.text :description
      t.string :image
      t.decimal :price, :precision => 8, :scale => 2, :default => 0

      t.timestamps
    end
  end
end
```

On crée un test unitaire.

```ruby
require 'test_helper'

class LivreTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test "Un livre invalide" do
    livre = Livre.new(:label => '', :price => 0)
    assert_not livre.save, "enregistre le livre sans label et avec un prix à 0"
  end
  test "Un livre invalide" do
    livre = Livre.new(:label => '', :price => 0)
    assert_not livre.save, "enregistre le livre sans label et avec un prix à 0"
  end
end
```

Et on fait nos migrations.

```bash
bundle exec rake db:migrate
bundle exec rake db:migrate RAILS_ENV=test
```

### Iteration 3
Nous avons mis en place la structure de notre application, nous allons passer à la construction du controleur d'administration et à la mise en place des directives minimales.

```bash
rails g controller livres index
```

#### L'application
Notre directive ngApp est le coeur de notre application.

```html 
<!-- app/views/layouts/application.html.erb -->
<!DOCTYPE html>
<html lang="fr" ng-app="angularRails">
```

Nous allons créer un script d'initialisation de notre application qui serra appellé avant tout autre de nos scripts.

```javascript 
// app/assets/javascripts/init.js
'use strict';

// initialisation de l'application
var angularRails = angular.module('angularRails', []);
```

Et on l'ajoute dans notre fichier **application.js**

```ruby 
# app/assets/javascripts/application.js
//= require angular
//= require init
//= require_tree .
```

#### Le template livres#index
Il est temps de mettre en place la vue listant nos livres. Nous ajoutons une directive ngController nommée **LivresIndexCtrl**. Elle gére une liste ngReapeat filtrée par par le ngModel **livreIndexRecherche**.
{% raw %}

```html 
<!-- app/views/livres/index.html.erb -->
<div class="form-inline" ng-controller="LivresIndexCtrl">
  <div >
    <label for="livreIndexRecherche">Recherche</label>
    <input id="livreIndexRecherche" ng-model="livreIndexRecherche">
  </div>
  <div>
    <ul>
      <li ng-repeat="livre in livres | filter:livreIndexRecherche">
        {{livre.label}}
        <p>{{livre.description}}</p>
        <span>{{livre.price}}</span>
      </li>
    </ul>
  </div>
</div>
```
{% endraw %}

Le javascript du controlleur AngularJS qui demqnde à notre controlleur Ruby de lui retourner la liste des livres sous forme de json.

```javascript 
// app/assets/javascripts/livres.js.erb
// récupère la liste des livres  
angularRails.controller('LivresIndexCtrl', function ($scope, $http) {
  $http.get('index.json').success(function(data) {
    $scope.livres = data;
  });
});
```

#### Le code du controlleur
Notre controlleur Ruby lui permet d'afficher la vue index qui va selon le type de format demandé, afficher le template livres#index ou lister les livres sous forme de json.

```ruby 
# app/controllers/livres_controller.rb
class LivresController < ApplicationController

  # Page principale
  #
  # Retourne la liste les livres disponibles
  def index
    @livres = Livre.all
    respond_to do |format|
      format.html
      format.json { render json: @livres }
    end
  end

end
```