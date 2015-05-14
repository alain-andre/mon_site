---
layout: post
author: Alain ANDRE
title: "Une gem qui permet d'ajouter des scripts"
date: 2014-04-22 19:10:53 +0200
comments: true
categories:
  - Ruby on Rails
tags:
  - Gem
  - Assets
  - Ajout script
---

Nous avons déjà vu comment créer une gem simplement, mais elle ne nous permettait pas de creer des helpers ou d'ajouter du script dans notre asset/. Dans ce post, je vais créer une gem dont j'ai souvent besoin qui m'ajoute les scripts mootools me permettant d'utiliser les fonctionnalités de Bootstrap sans avoir à charger JQuery. Pour commencer nous allons demander au Bundler un *petit* coup de main.

```bash
$ bundle gem bootstrap3_mootools
create  bootstrap3_mootools/Gemfile
create  bootstrap3_mootools/Rakefile
create  bootstrap3_mootools/LICENSE.txt
create  bootstrap3_mootools/README.md
create  bootstrap3_mootools/.gitignore
create  bootstrap3_mootools/bootstrap3_mootools.gemspec
create  bootstrap3_mootools/lib/bootstrap3_mootools.rb
create  bootstrap3_mootools/lib/bootstrap3_mootools/version.rb
Initializing git repo in /home/alain/01_projects/bootstrap3_mootools
```

Bundle a généré notre gemspec, notre lib, le Gemfile ainsi que le Rafefile; il a initialisé git, créé le .gitignore, le README et pour finir la LICENCE.

Grosso modo il a tout initialisé avec mes informations (mail, auteur) et a balisé les choses à faire avec de jolies %q{TODO: }

```ruby 
# bootstrap3_mootools.gemspec
# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'bootstrap3_mootools/version'

Gem::Specification.new do |spec|
  spec.name          = "bootstrap3_mootools"
  spec.version       = Bootstrap3Mootools::VERSION
  spec.authors       = ["Alain ANDRE"]
  spec.email         = ["wordsbybird@gmail.com"]
  spec.summary       = %q{TODO: Write a short summary. Required.}
  spec.description   = %q{TODO: Write a longer description. Optional.}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.6"
  spec.add_development_dependency "rake"
end
```

# L'ajout des scripts

```bash 
# Créer app/assets/javascripts
$ cd bootstrap3_mootools/
$ mkdir -p app/assets/javascripts
```

Je copie ensuite mes scripts dans ce nouveau dossier et j'ajoute la dépendance [railties](http://edgeapi.rubyonrails.org/classes/Rails/Railtie.html) à la fin de mon **gemspec**.

```ruby 
# bootstrap3_mootools.gemspec
spec.add_development_dependency "rake"
spec.add_dependency "railties", "~> 4.1"
```

Voilà ! Je peux construire ma gem et la tester.

```bash
$ bundle exec rake build
bootstrap3_mootools 0.0.1 built to pkg/bootstrap3_mootools-0.0.1.gem
```

Maintenant je vais tester ma gem dans le dossier test en créant une application rails avec mon option -j mootools

```bash
$ rails new test/dummy -j mootools
$ cd test/dummy
$ echo 'gem "bootstrap3_mootools", :path =>"../../bootstrap3_mootools/"' >> Gemfile
$ bundle install
$ echo '//= require bootstrap3_mootools' >> app/assets/javascripts/application.js
$ rails server &
```

Une fois tout ceci fait, je n'ai plus qu'à tester si mon fichier est bien présent dans l'application lancée :

```bash
$ curl http://localhost:3000/assets/bootstrap3_mootools.js
```

Il ne nous reste plus qu'à mettre tout ça à disposition sur github et RubyGems.
Si vous n'avez encore jamais envoyé de gems à RubyGems, vous devez y créer un compte et récupérer votre clé :

```bash
curl -u Alain_ANDRE https://rubygems.org/api/v1/api_key.yaml > ~/.gem/credentials; chmod 0600 ~/.gem/credentials
```

Maintenant il est possible de push.

```bash
$ rake release
```
