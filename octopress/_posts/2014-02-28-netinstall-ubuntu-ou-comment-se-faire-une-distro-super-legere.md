---
title: Netinstall ubuntu ou comment se faire une distro super legère.
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2014-02-28 20:06:36 +0200
categories:
  - Petits tutos
tags:
  - distrib legère
  - netinstall
  - ubuntu
---
J'ai un vieil ordinateur portable que mon épouse avait acheté et qui ne supporte plus Windows depuis longtemps (trois mois après son achat) mais qui -*et ça c'est le pire*- ne supporte plus les distros actuelles tel qu'elles sont livrées.

C'est un **AspireOne** dont les caractéristiques sont ci-dessous:

    CPU : 32b Intel Atom 2520 @1.33Ghz
      Cache : 512 KB
    RAM (ko) : 1016760
    VGA : Intel Corporation System Controller Hub (SCH Poulso) Graphics Controller (rev 07)


J'ai vraiment envie de garder mon environnement **Gnome shell** habituel, mais là il semble que c'est impossible. Alors je vais faire une installation via le net en ne prenant que le **minimum** de la distro. J'ai besoin d'apache, php, postgre, mongodb, nodejs, rails, ruby, git, terminal, sublime-text et firefox. Le reste ne m'importe absolument pas.

## Étape 1

Tout d'abord, il faut choisir la [version][1] que l'on souhaite installer. Une fois votre version choisie (saucy 32b pour moi), téléchargez la.

```bash
wget http://archive.ubuntu.com/ubuntu/dists/saucy/main/installer-i386/current/images/netboot/mini.iso
```

## Étape 2

On va maintenant se créer une clé usb bootable de notre mini.iso.

```bash
sudo fdisk -l # pour trouver votre clé USB
dd if=~/Downloads/mini.iso of=/dev/sdb
```

## Étape 3

Bootez sur la clé USB et suivez les instructions. Les installateurs sont vraiment super de nos jours, le partitionnement, le chiffrage, le LVM, la détection de la langue, du clavier etc.

## Étape 4

Voilà, maintenant nous pouvons ajouter les packages pour gnome.

```bash
sudo apt-get install -y python-software-properties software-properties-common
sudo add-apt-repository ppa:gnome3-team/gnome3
sudo apt-get update -y && sudo apt-get dist-upgrade -y && sudo apt-get autoremove -y

sudo apt-get install -y gnome-shell gnome-network-admin gnome-terminal \
gnome-tweak-tool network-manager-gnome file-rollerlanguage-pack-fr-base \
language-pack-fr language-pack-gnome-fr-base language-pack-gnome-fr gdm
```

Cette installation m'a permis d'avoir un shell assez fluide mais pas suffisant pour moi.

J'ai alors tenté une nouvelle installation avec au lieu de mettre **Gnome shell**, la **Lubuntu** minimale disponible via le netinstall. Au démarrage on peut même choisir un environnement netbook. Petite info pour installer Terminal : c'est LXTerminal :p

Aujourd'hui, la vitesse d’exécution ainsi que la stabilité de mon **AspireOne** est remarquable. Et pour plagier un certain fournisseur, je dirais "Merci Linux !".

 [1]: http://archive.ubuntu.com/ubuntu/dists/
