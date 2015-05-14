---
title: 'Heroku : impossible de faire un pull'
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-09-02 21:06:36 +0200
categories:
  - Heroku
tags:
  - heroku
  - permission denied
---
Il m'est arrivé une chose incroyable : vouloir faire un pull d'un repository que j'ai sur Heroku sur l'un de mes PC !!

Jusque là, rien de traumatisante; il suffit de faire un clone du repo et basta&#8230;sauf que ça n'a pas marché. J'avais déjà eu un repository Heroku sur ce PC mais je l'avais supprimé. J'ai donc créé un dossier dans lequel j'ai fait un petit `git init` puis j'ai rajouté le remote heroku, j'ai tenté le pull &#8230; erreur.

```bash
$ git pull heroku master
permission denied (publickey).
fatal: Could not read from remote repository.
Please make sure you have the correct access rights
```

Après mille essais et recherches sur le net, j'ai finalement trouvé la commande magique. Il suffisait de demander une nouvelle clé pour cet ordinateur là.

On liste les clés avec la commande suivante:

```bash
$ heroku keys
=== w@g.c Keys
ssh-rsa AAAB3NzaC..D9I1su5h alain@alain-12546fr
```

Et on demande une nouvelle clé (pour cet ordinateur) comme ceci :

```bash
$ heroku keys:add
```

Et voilà, mon `git pull heroku master` me rapatriait toutes mes données.

Il est aussi possible de supprimer une **clé SSH** installée:

```bash
$ heroku keys:remove alain@alain-12546fr
```
