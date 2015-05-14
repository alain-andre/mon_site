---
title: Installer Rails 4 et Ruby 2 sur une Ubuntu
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-09-03 02:06:36 +0200
categories:
  - Ruby on Rails
tags:
  - installer rails
  - installer ruby
---
Si l'on veut développer une application sous Rails 4 et Ruby 2, on se heurte à pas mal de problèmes. Les distributions ne sont pas forcement à jour. Il en est de même pour les serveurs Nodejs d’ailleurs. La meilleur façon que j'ai trouvé est donc de passer par un gestionnaire de version. On parle beaucoup de [RVM][1] mais je trouve [rbenv][2] bien plus pratique. Il y a [ici][3] une petite explication du pourquoi.

Bon; pour commencer il faut désinstaller les packages ruby, rails et gemfile déjà installés. Sur une distrib basée sur debian : `apt-get remove --purge`. Les commandes ci-dessous ne doivent rien retourner.

```bash
$ rails -v
$ ruby -v
```

Voilà tout est prêt pour une installation fraiche.

Évidement vous avez d'installé `build-essential libssl-dev` ! On va commencer par installer rbenv :

```bash
$ git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
$ exec $SHELL -l
```

La dernière ligne permet de relancer le shell afin de prendre en compte le dernier PATH. Si vous avez des onglets d'ouvert, faites de même pour chacun d'entre eux.

Ensuite, on va installer [ruby-build][4] afin de pouvoir utiliser la commande `rbenv install` :

```bash
$ git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
```

Voilà!

C'est parti pour une installation toute propre en local (fini les sudo pour installer des gems). On veut au moins installer la v2.0.0 alors :

```bash
$ rbenv install 2.0.0-p0
# on met à jour les liens
$ rbenv rehash
$ rbenv local 2.0.0-p0
```

Maintenant on installe rails et le bundler (sans sudo hein) :

```bash
$ gem install bundler
$ gem install rails --version 4.0.0.rc1
```

C'est fini, un petit test devrait valider les versions qu'on a choisi :

```bash
$ rails -v
Rails 4.0.0.rc1
$ ruby -v
ruby 2.0.0p0 (2013-02-24 revision 39474) [x86_64-linux]
```

# Notes
## No Readline support
Bon tout ne marchant jamais de la même manière (enfin souvent), je viens de tomber sur un os en faisant une installation fraiche sur mon PC fixe. Au moment de lancer mon

`rake db:reset`, j'ai le message suivant qui s'affiche :

```bash
You're running a version of ruby with no Readline support
Please `gem install rb-readline` or recompile ruby --with-readline.
```

Évidement la commande `gem install rb-readline` n'a rien résolue bien qu'elle m'ait installé la gem en question. Il a fallu installer `libreadline-dev` puis re-build la version de ruby que je voulais utiliser en passant les commandes suivantes :

```bash
CONFIGURE_OPTS="--with-readline-dir=/usr/include/readline" rbenv install 2.0.0-p0
```

On remet à jour les liens

```bash
$ rbenv rehash
$ rbenv local 2.0.0-p0
```
## Cannot load such file -- readline (LoadError)
Les versions 2.x de ruby ont un soucis avec readline. Une discution existe sur [ruby-build](https://github.com/sstephenson/ruby-build/issues/526)

En gros, pour le moment il existe un patch qui permet de résoudre ce problème. 

```bash 
curl -fsSL https://gist.github.com/mislav/a18b9d7f0dc5b9efc162.txt | rbenv install --patch 2.1.1
```

Depuis le 09 mai 2014, les versions 2.0.0-p481 and 2.1.2 sont stables et n'ont pas besoin de patch.


 [1]: https://rvm.io/
 [2]: https://github.com/sstephenson/rbenv
 [3]: https://github.com/sstephenson/rbenv/wiki/Why-rbenv%3F
 [4]: https://github.com/sstephenson/ruby-build
