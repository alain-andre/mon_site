---
layout: post
title: "Failed to run "java -version" : Je ne peux plus compiler mon projet Ionic"
date: 2016-05-29T18:50:02+02:00
comments: true
categories: 
 - Ionic
tags :
 - ionic
 - application hybride
---

Je travaille depuis quelques mois sur un projet Ionic. Tout se passe bien au niveau installation et configuration mais un jour, 
suite à une mise à jour de mon système d'exploitation, je suis incapable de compiler le projet pour Android.

```
$ ionic build android
Running command: /home/alain/01_projets/xxx/mobile/hooks/after_prepare/010_add_platform_class.js /home/alain/01_projets/xxx/mobile
add to body class: platform-android
Running command: /home/alain/01_projets/xxx/mobile/platforms/android/cordova/build 
[Error: Failed to run "java -version", make sure that you have a JDK installed.
You can get it from: http://www.oracle.com/technetwork/java/javase/downloads.
]
ERROR building one of the platforms: Error: /home/alain/01_projets/xxx/mobile/platforms/android/cordova/build: Command failed with exit code 2
You may not have the required environment or OS to build this project
Error: /home/alain/01_projets/xxx/mobile/platforms/android/cordova/build: Command failed with exit code 2
    at ChildProcess.whenDone (/usr/lib/node_modules/cordova/node_modules/cordova-lib/src/cordova/superspawn.js:139:23)
    at emitTwo (events.js:87:13)
    at ChildProcess.emit (events.js:172:7)
    at maybeClose (internal/child_process.js:821:16)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:211:5)
```

Interloqué par ce subit arret de ce qui fonctionnait, je commence à me demander si mes fichiers de configuration n'ont pas été touché lors 
de la mise à jour système, je regarde alors l'état de mon `~./bashrc` qui n'a pas bougé.

```bash
# Android Dev PATH
export ANDROID_HOME=~/android/Sdk
export PATH=${PATH}:~/android-studio/tools
export PATH=${PATH}:~/android-studio/platform-tools
```

Je reste bloqué sur cette phrase insultante à mes yeux : `You may not have the required environment or OS to build this project` 
et commence à inspecter ma configuration système. Un petit `java -version` me confime que j'ai bien la *1.8* d'installé.

```
openjdk version "1.8.0_91"
OpenJDK Runtime Environment (build 1.8.0_91-8u91-b14-0ubuntu4~16.04.1-b14)
OpenJDK 64-Bit Server VM (build 25.91-b14, mixed mode)
```

Je cherche donc le détails qui pourait bloquer :

```
alain@alain-Sys1:/usr/bin$ ls -l | grep java 
lrwxrwxrwx 1 root   root          22 mai   19 08:16 java -> /etc/alternatives/java
```

Ok, allons voir ça de plus pret :

```
alain@alain-Sys1:/etc/alternatives$ ls -l | grep java 
lrwxrwxrwx 1 root root  46 mai   19 08:16 java -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java
lrwxrwxrwx 1 root root  56 mai   19 08:16 java.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/java.1.gz
lrwxrwxrwx 1 root root  47 mai   19 08:16 jexec -> /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/jexec
lrwxrwxrwx 1 root root  52 mai   19 08:16 jexec-binfmt -> /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/jar.binfmt
lrwxrwxrwx 1 root root  45 mai   19 08:16 jjs -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/jjs
lrwxrwxrwx 1 root root  55 mai   19 08:16 jjs.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/jjs.1.gz
lrwxrwxrwx 1 root root  49 mai   19 08:16 keytool -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/keytool
lrwxrwxrwx 1 root root  59 mai   19 08:16 keytool.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/keytool.1.gz
lrwxrwxrwx 1 root root  46 mai   19 08:16 orbd -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/orbd
lrwxrwxrwx 1 root root  56 mai   19 08:16 orbd.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/orbd.1.gz
lrwxrwxrwx 1 root root  49 mai   19 08:16 pack200 -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/pack200
lrwxrwxrwx 1 root root  59 mai   19 08:16 pack200.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/pack200.1.gz
lrwxrwxrwx 1 root root  52 mai   19 08:16 policytool -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/policytool
lrwxrwxrwx 1 root root  62 mai   19 08:16 policytool.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/policytool.1.gz
lrwxrwxrwx 1 root root  46 mai   19 08:16 rmid -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/rmid
lrwxrwxrwx 1 root root  56 mai   19 08:16 rmid.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/rmid.1.gz
lrwxrwxrwx 1 root root  53 mai   19 08:16 rmiregistry -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/rmiregistry
lrwxrwxrwx 1 root root  63 mai   19 08:16 rmiregistry.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/rmiregistry.1.gz
lrwxrwxrwx 1 root root  52 mai   19 08:16 servertool -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/servertool
lrwxrwxrwx 1 root root  62 mai   19 08:16 servertool.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/servertool.1.gz
lrwxrwxrwx 1 root root  51 mai   19 08:16 tnameserv -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/tnameserv
lrwxrwxrwx 1 root root  61 mai   19 08:16 tnameserv.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/tnameserv.1.gz
lrwxrwxrwx 1 root root  51 mai   19 08:16 unpack200 -> /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/unpack200
lrwxrwxrwx 1 root root  61 mai   19 08:16 unpack200.1.gz -> /usr/lib/jvm/java-8-openjdk-amd64/jre/man/man1/unpack200.1.gz
```

Rien, tout est normal, je n'en peux plus. Et tout d'un coup, je me dit que le **JRE* est disponible mais Android lui 
recherche le **JDK** 
