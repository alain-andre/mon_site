---
title: 'Heroku : impossible de lancer rails 4.0'
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-09-03 18:06:36 +0200
categories:
  - Heroku
  - Ruby on Rails
tags:
  - erreur
  - heroku
  - rails 4
---
Je n'arrive pas à lancer mon appli Rails 4.0 sur **Heroku**, j'ai toujours le message suivant dans mes logs Heroku :

```
app[web.1]: /usr/bin/env: ruby1.9.1: No such file or directory
```

si je tappe un `heroku rails -v` j'ai cette erreur, le problème vient donc de là.

Après maintes recherches j'ai trouvé la solution. Si la commande `heroku config -s | grep PATH` ne vous retourne rien, c'est qu'il vous manque une partie de votre configuration. Il faut alors passer les paramètres suivants :

```bash
$ heroku config:set GEM_PATH=vendor/bundle/ruby/2.0.0
$ heroku config:set PATH=bin:vendor/bundle/ruby/2.0.0/bin:/usr/local/bin:/usr/bin:/bin
```

De là il va falloir arrêter le Bundler de génération de stub. Les applications Rails 4 ne sauvegardent pas les stubs dans le bin/ de l'application. C'est parti :

```bash
$ bundle config --delete bin
# Met à jour le bin/ pour les exécutables Rails 4
$ rake rails:update:bin
# On ajoute le nouveau bin/ à git
$ git add bin
```

Commit, push et voilà votre application se lance sans problème. Enfin reste à configurer activeRecord ou autre :p
