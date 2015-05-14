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
  - installer nodejs
  - ubuntu
---
Il est possible d'installer NodeJs sous Ubuntu depuis les repos proposés par la distribution. Mais la version n'est pas toujours à jour. NodeJs est la dernière technologie en vogue dans le monde du web et nombre de packages évoluent très vite et on des pré-requis de version du serveur.

Il est possible de charger les sources et tout compiler, oui, mais ça n'est pas très propre -enfin à mon avis- Heureusement les PPA sont à notre disposition.

```bash
$ sudo add-apt-repository ppa:chris-lea/node.js
$ sudo apt-get update
$ sudo apt-get install nodejs
```

Et voilà, vous avez la dernière version de **nodejs** et **npm** sur votre machine ;p
