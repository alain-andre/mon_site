---
title: Erreur d'affichage des images sous Heroku
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-10-16 21:06:40 +0200
categories:
  - Heroku
  - Ruby on Rails
tags:
  - asset
  - heroku
  - image
---
Tout allait très bien en local, les images de fond de mes classes se chargeaient sans soucis. Mais une fois envoyé sous Heroku, pas d'image et un message `moved permanently` m'informe du problème.

Après avoir tenté des resets de cache, des builds et maintes actions inutiles, j'ai finalement trouvé que le problème venait du numéro de version de l'image utilisé dans l'*asset* qui n'était pas le fichier scss.

En effet, il suffisait de remplacer `url`

```ruby
background: url("img.png") no-repeat scroll 0 50% transparent
```

par le helper `asset_url`

```bash
background: asset_url("img.png", image) no-repeat scroll 0 50% transparent
```

Et voilà !! Plus de problème d'affichage d'image sous Heroku.
