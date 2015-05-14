---
title: Reset de base sur Heroku
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-10-24 10:06:36 +0200
categories:
  - Heroku
  - Ruby on Rails
tags:
  - migration
  - rails
---
Les migrations sont une façon magique de faire évoluer nos tables sans avoir à faire des tonnes de manipulations. Mais s'il est simple en local de faire une mise à zéro,

```bash
$ rake db:reset db:setup
```

`db:setup` est similaire à `rake db:create db:migrate db:seed`

Sur Heroku cette commande retourne une erreur. Pour pouvoir faire un reset, il faut utiliser la commande suivante : `heroku pg:reset DATABASE_URL`. Par exemple pour mon application `super-app` qui utilise l'url stockée dans la variable d'environnement `HEROKU_POSTGRESQL_CYAN_URL` :

```bash
$ heroku pg:reset HEROKU_POSTGRESQL_CYAN_URL

!    WARNING: Destructive Action
!    This command will affect the app: super-app
!    To proceed, type "super-app" or re-run this command with --confirm super-app

> super-app
Resetting HEROKU_POSTGRESQL_CYAN_URL... done
$ heroku run rake db:migrate db:seed
```
