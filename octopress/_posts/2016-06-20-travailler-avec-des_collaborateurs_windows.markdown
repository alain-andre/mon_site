---
title: Travailler avec des collaborateurs windows sur RoR
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2016-06-20 15:06:36 +0200
categories:
  - Heroku
  - Ruby on Rails
tags:
  - Gemfile
  - rubyinstaller
  - CUSTOM_RUBY_VERSION
---

Lorsque vous travaillez sur un projet avec des collaborateurs qui ne font pas partie de la même société, il arrive qu'ils soient sur le système d'exploitation hostile. Il faut alors palier à certaines difficultés.

Windows a en effet peut de version facilement installable. Après avoir tenté divers installateurs, il m'est apparu qu'il valait mieux installer RoR à l'aide de [rubyinstaller](http://rubyinstaller.org/). Cet installateur fait gagner beaucoup de temps : Sqllite est alors disponible par exemple. Le seul hic est qu'ils ne fournissent pas toutes les versions de ruby.

## La spécification de la version de ruby
Après avoir tenté de mettre tout le monde à la version disponible pour Windows, il s'est avéré plus simple et plus extensible de configurer la version dans l'environnement. Ceci a deux objectifs : 
- Les utilisateurs de Windows créent une variable d'environnement *CUSTOM_RUBY_VERSION* à laquelle ils affectent la valeur de leur version de ruby
- Lors des tests en CI, il est possible de tester plusieurs versions de ruby

```ruby
# Gemfile
ruby ENV['CUSTOM_RUBY_VERSION'] || '2.1.2'
```

## Les dates et heures
Les utilisateurs de Windows avaient des problèmes avec les DateTime, il a fallu ajouter une gem `tzinfo-data` afin que tout se passe bien. Heureusement, il est possible dans le Gemfile de conditionner une gem à une ou plusieurs plateforme(s).

```ruby
#Gemfile
gem 'tzinfo-data', platforms: [:mingw, :mswin]
gem 'unicorn', platforms: :ruby # linux
```
