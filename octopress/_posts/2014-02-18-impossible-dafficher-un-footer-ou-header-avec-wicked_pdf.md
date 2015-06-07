---
title: "Impossible d'afficher un footer ou header avec wicked_pdf"
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2014-02-18 18:06:36 +0200
categories:
  - Ruby on Rails
tags:
  - header
  - pdf
  - wkhtmltopdf
---
Depuis mon installation en local sur mon Ubuntu (cf cet [article]({{url}}/heroku/ruby on rails/2013/10/23/generer-des-pdf-simplement-avec-wkhtmltopdf-sur-heroku.html)), je n'arrive pas à afficher un **header** ou un **footer** dans mes PDFs. Après avoir cherché partout dans la galaxie du web, j'ai finalement trouvé une piste qui s'est avérée très inintéressante et même salvatrice. Je n'aime pas installé des composants à la main sur mon système, mais là, c'est une obligation.

## Première étape

Il faut tout d'abord supprimer le **wkhtmltopdf** précédemment installé

```bash Nettoyage de la distro
sudo apt-get remove --purge wkhtmltopdf
```

## Deuxième étape

Ensuite on va télécharger l'archive qui nous intéresse chez [github.com/wkhtmltopdf](https://github.com/wkhtmltopdf/wkhtmltopdf/releases/)

`openssl build-essential xorg libssl-dev` doivent être installé sur votre machine.

```bash 
# Installer wkhtmltopdf
wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.0/wkhtmltox-linux-amd64_0.12.0-03c001d.tar.xz
tar -xJf wkhtmltox-linux-amd64_0.12.0-03c001d.tar.xz
cd wkhtmltox/bin/
sudo chown root:root wkhtmltopdf
```

### Dernière étape

Pour finalement la copier dans notre /usr/bin

```bash
sudo cp wkhtmltopdf /usr/bin/wkhtmltopdf
```
