---
title: Installation de NodeJs sous Ubuntu
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-12-27 21:10:36 +0200
categories:
  - Petits tutos
tags:
  - nodejs
  - ubuntu
  - npm
---
**nb** : Cet article a été ré-édité en juin 2015 afin de se mettre à jour.

Il est possible d'installer **NodeJs** sous **Ubuntu** depuis les repos proposés par la distribution. Mais la version n'est pas toujours à la version que l'on souhaite. NodeJs est une technologie en vogue dans le monde du web et nombre de packages évoluent très vite et on des prérequis de version du serveur. 

Sans compter qu'un paquet s'appelant *node* existe déjà dont la description est : Amateur Packet Radio Node program et qui rend tout un peu confus. Il y a des actions particulières à faire pour pouvoir appeler nodejs lorsque l'on appelle la commande `node`.

Il est possible de charger les sources et tout compiler, oui, mais ça n'est pas très propre -enfin à mon avis- Heureusement les *PPA* sont à notre disposition.

Avant juillet 2014, nous utilisions le ppa de **chris-lea**, mais depuis leur intervention sur [nodesource](https://nodesource.com/blog/chris-lea-joins-forces-with-nodesource), ce *ppa* ne serra plus maintenu.

Il faut donc utiliser le script qu'ils nous mettent à disposition afin de nettoyer l'ancien *ppa* si besoin, d'ajouter la clé, les nouvelles sources et mettre à jour les repos. Il faut utiliser `setup_0.10` pour nodejs 0.10.x et `setup_0.12` pour nodejs 0.12.x.

```bash
$ curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
```

Une fois fait, il ne reste qu'à installer node.

```bash
sudo apt-get install -y nodejs
```

Et voilà, vous avez la dernière version de **nodejs** et **npm** sur votre machine et vous pouvez l'appeller simplement par la commande `node` et non `nodejs`.
