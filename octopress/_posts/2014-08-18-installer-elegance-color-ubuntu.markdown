---
layout: post
author: Alain ANDRE
title: "Installer elegance color sous Ubuntu"
date: 2014-08-18 18:24:25 +0200
comments: true
categories:
  - Petits tutos
tags :
  - ubuntu
  - gnome shell
---

Sous gnome shell, l'aspect de l'interface se gère via le Tweak Tool disponible dans la liste des programmes de votre système.

# Elegance colors
C'est un thème propre et configurable à souhait. Pour l'installer, il faut tout d'abord ajouter le **ppa** dans vos repos.

```bash
sudo add-apt-repository ppa:satyajit-happy/themes
sudo apt-get update
sudo apt-get install gnome-shell-theme-elegance-colors
```

Il suffit ensuite ensuite de lancer `elegance-colors` pour choisir un thème et le configurer comme on le souhaite.

# Faenza icons
Pour les icônes, j'aime assez **Faenza**. Il y a des ppa disponibles mais la plus par du temps ils ne sont pas à jour. Je préfère donc passer par une installation manuelle.

Téléchargez le [ici](http://gnome-look.org/content/download.php?content=128143&id=1&tan=31810885&PHPSESSID=de43d2487d514e4e0d93a6eda822b5d3) dézipez le, entrez dans le nouveau dossier et dézipez tous les `tar.gz`.

Il ne vous reste plus qu'à collez les dossiers dézipés dans votre *~/.icons* (à créer s'il n'existe pas) et voilà.
