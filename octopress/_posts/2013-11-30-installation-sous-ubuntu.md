---
title: Installation de MongoDB, pymongo et bottle sous Ubuntu
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-11-30 21:07:36 +0200
categories:
  - MongoDB
  - Petits tutos
tags:
  - mongodb
  - python
---
MongoDB est une base de données NoSQL, orientée documents et ne nécessitant pas de schéma prédéfini des données. Actuellement en formation &#8220;MongoDB for Developers&#8221; je me rend compte avec tristesse que les cours ne prennent pas en compte les utilisateurs Linux. Étant sur Ubuntu et ne pouvant passer sur un Mac, je vais expliquer sur ce poste comment installer MongoDB et python pour la formation.

Tout d'abord python. Bon là c'est facile on n'a rien à faire, Python est déjà installé. Il suffit de vérifier votre version :

```bash
$ python -V
Python 2.7.3
```

Super il nous reste à installer MongoDB, Bottle.py et PyMongo. On va commencer par le plus simple :

```bash
$ sudo apt-get install MongoDB
....
Paramétrage de libboost1.49-dev (1.49.0-3.1ubuntu1.2) ...
Paramétrage de libboost-dev (1.49.0.1) ...
Paramétrage de libboost-system1.49.0 (1.49.0-3.1ubuntu1.2) ...
Paramétrage de libboost-filesystem1.49.0 (1.49.0-3.1ubuntu1.2) ...
Paramétrage de libboost-program-options1.49.0 (1.49.0-3.1ubuntu1.2) ...
Paramétrage de libboost-thread1.49.0 (1.49.0-3.1ubuntu1.2) ...
Paramétrage de mongodb-clients (1:2.0.6-1ubuntu4) ...
Paramétrage de mongodb-server (1:2.0.6-1ubuntu4) ...
Ajout de l utilisateur système « mongodb » (UID 118) ...
Ajout du nouvel utilisateur « mongodb » (UID 118) avec pour groupe d appartenance « nogroup » ...
Le répertoire personnel « /home/mongodb » n a pas été créé.
Ajout du groupe « mongodb » (GID 129)...
Fait.
Ajout de l utilisateur « mongodb » au groupe « mongodb »...
Ajout de l utilisateur mongodb au groupe mongodb
Fait.
mongodb start/running, process 5180
```

Bien, maintenant pour PyMongo et Bottle.py : En cherchant sur internet on entend souvent parler d'`easy_install` mais après avoir testé et remarqué la gène occasionnée si l'on souhaite supprimer un `.egg`, je préfère passer par `pip`.

```bash
$ sudo apt-get install build-essential python3-dev python-dev python-pip
Réception de : 1 http://fr.archive.ubuntu.com/ubuntu/ saucy/main python-setuptools all 0.6.37-1ubuntu1 [455 kB]
Réception de : 2 http://fr.archive.ubuntu.com/ubuntu/ saucy/universe python-pip all 1.4.1-2 [313 kB]
Réception de : 1 http://fr.archive.ubuntu.com/ubuntu/ saucy/main libpython3.3-dev i386 3.3.2-7ubuntu3 [27,1 MB]
Réception de : 2 http://fr.archive.ubuntu.com/ubuntu/ saucy/main libpython3-dev i386 3.3.2-14ubuntu1 [8 280 B]
Réception de : 3 http://fr.archive.ubuntu.com/ubuntu/ saucy/main python3.3-dev i386 3.3.2-7ubuntu3 [360 kB]
Réception de : 4 http://fr.archive.ubuntu.com/ubuntu/ saucy/main python3-dev i386 3.3.2-14ubuntu1 [1 158 B]

$ sudo pip install pymongo
Downloading/unpacking pymongo
  Downloading pymongo-2.6.3.tar.gz (324kB): 324kB downloaded
  Running setup.py egg_info for package pymongo

Installing collected packages: pymongo
  Running setup.py install for pymongo
    building 'bson._cbson' extension
    .............................
Successfully installed pymongo
Cleaning up...

$ sudo pip install bottle
Downloading/unpacking bottle
  Downloading bottle-0.11.6.tar.gz (60kB): 60kB downloaded
  Running setup.py egg_info for package bottle

Installing collected packages: bottle
  Running setup.py install for bottle
    changing mode of build/scripts-2.7/bottle.py from 644 to 755

    changing mode of /usr/local/bin/bottle.py to 755
Successfully installed bottle
Cleaning up...
```

Et voilà tout est prêt.
