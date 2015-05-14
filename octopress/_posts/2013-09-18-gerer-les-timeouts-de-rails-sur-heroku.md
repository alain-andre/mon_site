---
title: Gérer les timeouts de rails sur Heroku
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-09-18 15:06:36 +0200
categories:
  - Heroku
  - Ruby on Rails
tags:
  - dyno
  - heroku
  - time-out
---
Parfois une requête web peut prendre trop de temps à traiter votre requête. Lorsque cela se produit, le routeur abandonne la requête si elle prend plus de 30 secondes à se terminer. Le compte à rebours commence au moment où le routeur lâche la requête. Le **dyno** de votre application a alors 30 secondes pour la traiter et la retourner au routeur pour éviter le timeout.

Il est important pour une application de ne pas avoir de **timeout** lors de l'upload d'une image, l'envoie d'un mail ou encore la génération d'un PDF. Car lorsque ceci arrive, une page est retournée au client et une trace est affichée dans les logs de votre serveur mais votre application va continuer à travailler sur cette requête. Pour éviter que l'application ne continue de travailler pour rien, il est conseillé de paramétrer un timeout après 10-15 secondes. Pour un serveur tournant sur Unicorn, définissez le dans le fichier `config/unicorn.rb` :

```ruby 
#unicorn.rb
timeout 15
```

Ceci va permettre à l'application de savoir si le délais de la requête est trop long et va lancer un *SIGKILL* au **worker** mais aucune exception ne va être levée. La gem [rack-timeout][1] permet d’empêcher l'application de travailler dans le vide et va en plus lever une exception pour nous permettre d'obtenir une trace.

Maintenant il nous reste à debugger ces timeouts pour les éviter. Par exemple pour l'upload d'image via paperclip, on peut le faire tourner en [background][2]

 [1]: https://github.com/kch/rack-timeout
 [2]: http://www.alain-andre.fr/blog/2013/09/19/faire-tourner-paperclip-en-background/
