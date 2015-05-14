---
layout: post
author: Alain ANDRE
title: "Installer une ROM firefoxOS sous GeeksPhone"
date: 2014-08-20 20:44:15 +0200
comments: true
categories:
  - Petits tutos
tags :
  - firefox
  - firefoxos
  - geeksphone
---

# Prérequis
## La ROM de votre model
Tou d'abord, il faut aller sur le site de [Geeksphone](http://downloads.geeksphone.com/) pour télécharger la ROM du model que vous utilisez.
## Les applicatifs android-tool
Les applicatifs **adb** et **fastboot** sont necessaires au flash

```bash
sudo apt-get install android-tools-adb android-tools-fastboot
```

# Installation
Une fois la ROM téléchargée, dézipez et allez avec votre Terminal dans le dossier. Il faut regarder si le fichier *flash.sh* appelle les programmes en local `./adb` si c'est le cas, retirez les `./` de devant tous les programmes et passez à la suite.

Flachez votre téléphone.

```bash
sudo ./flash.sh
* daemon not running. starting it now on port 5037 *
* daemon started successfully *
< waiting for device >
sending 'boot' (5580 KB)...
OKAY [  0.781s]
writing 'boot'...
OKAY [  1.104s]
finished. total time: 1.885s
Do you want to keep user data? (This may cause problems at reboot. If it does, please reflash and select the option not to keep the data)
1) Yes
2) No
#? 2
erasing 'userdata'...
OKAY [ 17.139s]
sending 'userdata' (32860 KB)...
OKAY [  2.746s]
writing 'userdata'...
OKAY [  7.671s]
finished. total time: 27.557s
sending 'system' (180008 KB)...
OKAY [ 15.018s]
writing 'system'...
OKAY [ 45.865s]
finished. total time: 60.883s
sending 'recovery' (6764 KB)...
OKAY [  0.566s]
writing 'recovery'...
OKAY [  1.244s]
finished. total time: 1.810s
******** Did you mean to fastboot format this partition?
erasing 'cache'...
OKAY [  0.092s]
finished. total time: 0.093s
rebooting...

finished. total time: 0.001s
```

Voilà, c'est fini !!

# Sources
[hacks.mozilla.org](https://hacks.mozilla.org/2013/06/updating-and-tweaking-your-firefox-os-developer-preview-phonegeeksphone/)
