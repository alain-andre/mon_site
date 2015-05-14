---
layout: post
author: Alain ANDRE
title: "Déployer Middleman sur Heroku via Travis CI"
date: 2015-03-05 14:48:42 +0100
comments: true
published: true
categories: 
  - Ruby on Rails
  - Heroku
tags :
  - Ruby
  - middleman
  - heroku
---

L'objectif est d'automatiser le déploiement d'un site du type [middleman](https://github.com/middleman/middleman) vers la production sur [heroku](https://devcenter.heroku.com/) après la validation des tests exécutés par [travis-ci](https://travis-ci.com/).

# Middleman
Middleman est un générateur de sites statiques utilisant les derniers outils de développement tels que **sass**, **Haml** etc. Je l'utilise pour des présentations comme ma [présentation du web](https://github.com/alain-andre/presentation-web).

# Travis CI
Il s'agit d'un environnement de génération qui permet de tester les applications déposées sur [Github](https://github.com).

Travis CI fournit différents *runtimes* pour différents langages, par exemple plusieurs versions de Ruby, PHP, Node.js. Il est également livré préinstallé avec une variété de banques de données et d'outils communs tels que les courtiers de message.

Vous pouvez facilement tester votre projet pour une ou plusieurs versions de langages et même de banques de données.

# L'intégration
Il vous faut utiliser ruby v2.

Vous pouvez ensuite installer travis de la sorte :

```bash
gem install travis -v 1.7.5 --no-rdoc --no-ri
```

En admettant que vous ayez déjà les outils heroku d'installer, vous devez créer un token encrypté (avec des repos publics il vaut mieux !) de votre clé api heroku.   

```bash
travis encrypt $(heroku auth:token) --add deploy.api_key
```

Il est maintenant possible de configurer votre fichier `.travis.yml`

```bash
travis setup heroku
```

Cella vous ajoute dans le fichier une partie `deploy`.

```bash
deploy:
  provider: heroku
  api_key:
    secure: DkMBDgmZtiI8leX0IyyQ/xiY1MdNXuOd6fnCihqJA8KK2YMluZqbWNnTkWxkhAsEApSLd1oxzsZ8XTMkcsefsNXyRbHHbzXmO7C7iUaxFQpop8A58C1iO9Yy/WyaPSRbvdi2u7el47sYNfxLhOMXax3WvAz0sYKN+AlTYn1YWvk=
  app: presentation-web
  on:
    repo: alain-andre/presentation-web
```

Mais ceci ne suffit pas pour faire en sorte que le site soit opérationnel sur Heroku. Middleman étant un générateur de site, il va falloir dire à Heroku comment le construire et comment le lancer. 

# Configuration Heroku
## Rakefile
Il faut créer un fichier `Rakefile` qui va être utilisé par Heroku pour générer le site. Heroku va automatiquement lancer la tâche `assets:precompile`, donc on en profite.

```ruby 
# Rakefile
namespace :assets do
  task :precompile do
    sh 'middleman build'
  end
end
```

## config.ru
Pour faire tourner un site statique Middleman sur Heroku, le site fonctionnera comme une application Rack; il faudra donc un fichier `config.ru`.

```ruby 
# config.ru
require 'rack'
require 'rack/contrib/try_static'

# Serve files from the build directory
use Rack::TryStatic,
  root: 'build',
  urls: %w[/],
  try: ['.html', 'index.html', '/index.html']

run lambda{ |env|
  four_oh_four_page = File.expand_path("../build/404/index.html", __FILE__)
  [ 404, { 'Content-Type'  => 'text/html'}, [ File.read(four_oh_four_page) ]]
}
```

La section `Rack::Trystatic` va tenter de livrer les fichiers statiques générés par Middelman à Heroku. Si le processus ne fonctionne pas, il lancera une erreur 404. Pour ceci, il faut avoir ajouté `rack-contrib` dans le **Gemfile**.

## Procfile
Pour finir, Heroku va exécuter les commandes du fichier Procfile; il faut donc donner la commande qui monte le serveur.

```ruby 
web: bundle exec middleman server -p $PORT
```

# Sources
[jordanelver: how-i-deployed-middleman-to-heroku](http://jordanelver.co.uk/blog/2014/02/17/how-i-deployed-middleman-to-heroku/)
[travis: heroku deployment](http://docs.travis-ci.com/user/deployment/heroku/)
[github: travis installation](https://github.com/travis-ci/travis.rb#installation)
[travis getting started](http://docs.travis-ci.com/user/getting-started/)