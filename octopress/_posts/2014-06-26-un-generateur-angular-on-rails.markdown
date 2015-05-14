---
layout: post
author: Alain ANDRE
title: "Un Générateur Angular on Rails"
date: 2014-06-26 10:52:32 +0200
comments: true
categories: 
  - Ruby on Rails
  - angularjs
tags:
  - angular
  - rails
  - templating
---

# Informations
Cette page a été modifiée suite à l'amélioration de l'intégration d'angularjs dans rails (cf. [Configurer Rails Avec AngularJS](/blog/2015/01/23/configurer-rails-avec-angularjs/))

Un [repo](https://github.com/alain-andre/ar-template) sous github est disponible et toujours en développement

# Le concept
L'idée est de construire un environnement rails qui permet de créer un projet avec les composantes minimales pour une application AngularJS utilisant Bootstrap de Twitter et une gestion d'authentification. Rails nous propose pour faire cela de créer un **template**. Ce template doit posséder un générateur. Ce générateur va permettre de développer rapidement des **scaffolding** d'application AngularJS.

# L'interet
Cela permet d'utiliser *erb* et *haml* dans les fichiers de l'assets ainsi que l'appel aux partiels. Ce template rails permet aussi l'intégration des fichiers I18 dans la structure de l'application AngularJS.
