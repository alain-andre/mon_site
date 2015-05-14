---
title: Rails cannot load such file readline
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-12-27 21:06:36 +0200
categories:
  - Ruby on Rails
tags:
  - build rails
  - rbenv
---
Suite à une réinstallation sur un poste de travail, je suis surpris de tomber sur une erreur lors de la tentative de lancement de la console de rails.

```ruby
$ rails console
/home/alain/.rbenv/versions/2.0.0-p0/lib/ruby/2.0.0/irb/completion.rb:9:in `require': cannot load such file -- readline (LoadError)
from /home/alain/.rbenv/versions/2.0.0-p0/lib/ruby/2.0.0/irb/completion.rb:9:in `<top (required)>'
from /home/alain/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/railties-4.0.0/lib/rails/commands/console.rb:3:in `require'
from /home/alain/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/railties-4.0.0/lib/rails/commands/console.rb:3:in `<top (required)>'
from /home/alain/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/railties-4.0.0/lib/rails/commands.rb:53:in `require'
from /home/alain/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/railties-4.0.0/lib/rails/commands.rb:53:in `<top (required)>'
from bin/rails:4:in `require'
from bin/rails:4:in `<main>'
```


Après quelques recherches, il s'avère nécessaire d'installer `libreadline-dev`

```bash
sudo apt-get install libreadline-dev
```

Puis il faut ré-installer la version de ruby avec les options readline

```bash
$ CONFIGURE_OPTS="--with-readline-dir=/usr/include/readline" rbenv install 2.0.0-p0
$ rbenv rehash
$ rbenv local 2.0.0-p0
```
