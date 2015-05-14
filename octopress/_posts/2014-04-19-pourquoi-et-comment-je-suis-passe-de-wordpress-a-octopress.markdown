---
layout: post
author: Alain ANDRE
title: "Pourquoi et comment je suis passé de wordpress à Octopress"
date: 2014-04-19 21:06:36 +0200
comments: true
categories:
  - Ruby on Rails
tags:
  - octopress
  - wordpress
  - rapidité
---
Depuis un certain temps, j'utilise Wordpress pour mon blog, je l'avais hébergé sur Heroku (oui c'est [possible](https://github.com/mchung/wordpress-on-heroku)) car même sur mon serveur dédié (une Debian super configurée) le blog prenait trop de temps à s'afficher. Bon j'ai gagné de la réactivité mais quand même quoi, ce n'est pas un miracle.

Je me suis dit qu'il devait bien y avoir un blog en Ruby qui traine sur la toile, alors je me suis mis à chercher et je me suis aperçu d'une chose ahurissante : je connaissais et j'allais régulièrement sur des blogs écrits en ruby. Et oui il y en a plein plein partout. Nombre de posts techniques que je lisais étaient sur des blogs générés par [Octopress](http://octopress.org).

## Octo quoi ?
**Octopress** est un framework qui utilise un outil magique (oui il y a plein de choses magiques en ruby) j'ai nommé [jekyllrb](http://jekyllrb.com/). C'est ce générateur de sites statiques qui est utilisé par Github. À oui tout de suite ça fait plus sérieux hein !

## Un site statique mais ce n'est pas la préhistoire ça ?
Oui et non. Il n'y a pas plus rapide qu'un site statique et Octopress nous permet de générer des pages à l'aide de `Rake` de façon très simple. Vous l'avez compris c'est bien un blog de développeur ou aux autres adeptes du markdown et des lignes de commandes. Bref, super pour moi.

## Ok, et une installation ça prend combien de temps ?
Heu.. 5 minutes si vous êtes déjà sur Ruby, sinon ça dépend de votre environnement et de vos connaissances. Tout est écrit [ici](http://octopress.org/docs/setup/)

## Et c'est simple de migrer ?
Disons que oui. Il y a un plugin wordpress [wordpress-to-jekyll-exporter](https://github.com/benbalter/wordpress-to-jekyll-exporter) qui permet de télécharger tous le site sous forme de fichiers. Les posts se trouvent dans un dossier `_posts` que l'on doit coller dans le dossier `source` de notre installation.

## Et ça s'héberge facilement ?
Les tutos pour les déploiements sur les divers hébergeurs : [Github](http://octopress.org/docs/deploying/github), [Rsync](http://octopress.org/docs/deploying/rsync) et [Heroku](http://octopresssorg/docs/deploying/heroku).

Pour Heroku, j'ai un peu (beaucoup) galéré pour obtenir ce que je voulais. Dans le tutoriel, ils proposent de supprimer `public` du `.Gitignore` pour tout pusher vers votre application Heroku; mais ce n'est pas une solution qui me va.

Je veux pouvoir faire des push vers Github et le dossier public -`qui change tout le temps`- ne doit pas faire parti du package.

J'ai donc décidé de tenter la génération sur Heroku (un build pack ou autre) mais le fichier `.Slugignore` contient les noms des dossiers `sass`, `source` et `plugins` ce qui rend impossible d'utiliser rake dans heroku. J'ai vu des build-pack disponibles pour faire marcher tout ça mais je prefère rester au plus simple et au plus proche du service proposé par heroku.

La solution qui m'a donc paru la plus propre et que j'ai trouvé chez [joshuawood.net](http://joshuawood.net/how-to-deploy-jekyll-slash-octopress-to-heroku/) a été de créer un dossier `_heroku` à la racine du projet blog et d'y déposer le `Gemfile` dont on ne laisse que **sinatra**, le `config.ru` et de créer un dossier `public` qui va nous servir à y déposer le blog généré. Je vous laisse lire son post, il est vraiment génial.

La seule chose que je préconise avant toute tentative de déploiement est de faire un petit `bundle install` dans votre dossier **_heroku**.
