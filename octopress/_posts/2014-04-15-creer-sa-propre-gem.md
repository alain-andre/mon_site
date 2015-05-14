---
title: Créer sa propre gem
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2014-04-15 15:01:36 +0200
categories:
  - Ruby on Rails
tags:
  - gem
  - ruby
---
On utilise souvent les mêmes bout de code (classes et autres helpers) dans divers projets ainsi que les mêmes gems. Mais notre code est souvent ajouté tel que dans notre architecture alors que l'on pourrait être bien plus propre et bien plus performant. Créer une gem est pourtant assez simple. Basé sur [rubygems.org][1] je vais décrire ici les fondamentaux.

Tout d'abord, pour notre gem `my_gem`, nous allons créer l'arborescence suivante :

```bash 
# ls my_gem
my_gem
.
├── my_gem.gemspec
└── lib
    └── my_gem.rb
```

Notre fichier `my_gem.gemspec` doit être au moins constitué des [paramètres][2] suivants (à vous de les modifier à votre guise) : Il y a un nombre important de paramètres que l'on peut utiliser et comme vous le voyez, c'est du Ruby; il est donc possible d'inclure du script !

```ruby 
# my_gem.gemspec
Gem::Specification.new do |s|
  s.name        = 'my_gem'
  s.version     = '0.0.1'
  s.date        = '2014-04-15'
  s.summary     = "Ma gem de communication !"
  s.description = "Ma gem pour dire salut à tous !"
  s.authors     = ["Alain ANDRE"]
  s.email       = 'contact@alain-andre.fr'
  s.files       = ["lib/my_gem.rb"]
  s.homepage    = 'http://rubygems.org/gems/my_gem'
  s.license     = 'MIT'
end
```

Notre fichier principal d’exécution `lib/my_gem.rb` se nomme comme notre gem. La class est bien MyGem car nous utilisons les [conventions de nommage][3] de rails.

```ruby 
# lib/my_gem.rb
class MyGem
  def self.salut
    puts "Salut tout le monde !"
  end
end
```

Voila ! c'est le minimum. On va pouvoir **construire** notre super gem.

```bash
$ gem build my_gem.gemspec
Successfully built RubyGem
Name: my_gem
Version: 0.0.1
File: my_gem-0.0.1.gem
```

Pour l'utiliser on va l'installer à partir de notre dossier source :

```bash
$ gem install ./my_gem-0.0.1.gem
Successfully installed my_gem-0.0.1
Parsing documentation for my_gem-0.0.1
Installing ri documentation for my_gem-0.0.1
Done installing documentation for my_gem after 0 seconds
Done installing documentation for my_gem (0 sec).
1 gem installed
```

Et on va l'utiliser afin de la tester :

```bash
$ irb
>> require 'my_gem'
=> true
>> MyGem.salut
Salut tout le monde !
=> nil
```

Maintenant on va la déployer sur rubygem.org afin que tous puissent en profiter (il vous faut avoir un compte rubygem).

```bash
$ gem install gemcutter
$ gem push my_gem-0.0.1.gem
```

Très bien on est tout fier, mais cette gem n'est pas si géniale que ça. Il n'y a pas de doc, on n'utilise qu'un seul fichier et même pas de script. On va remédier à tout ça.

## Itération 1 : Ajouter la doc.

C'est assez simple, il suffit de **commenter votre code** à la javadoc ou presque:
```ruby my_gem.rb
# Le driver principal de MyGem
class MyGem

  # Dire salut à tout le monde
  #
  # Example:
  #   >> MyGem.salut
  #   => Salut tout le monde !
  def self.salut
    puts "Salut tout le monde !"
  end

  # Dire salut à quelqu'un
  #
  # Example:
  #   >> MyGem.salut_qu("Georges")
  #   => Salut à toi Georges !
  #
  # Arguments:
  #   personne: (String)
  def self.salut_qu(personne = "le monde")
    puts "Salut à toi #{personne} !"
  end

end
```

## Itération 2 : Du script dans notre gemspec et la prise en compte de plus qu'un fichier.

Pour ajouter un autre fichier à prendre en compte dans notre **gemspec**, il suffit de l'ajouter dans notre array. Mais si l'on veut ajouter une directory toute entière on fait comment ? Disons que l'on va ajouter des tests à notre gem (Un petit **test unitaire** pour valider notre gem ne peut pas faire de mal). Et que pour ajouter plus de fichiers, on va utiliser **rake**.

Ce qui va nous donner ceci :

```ruby 
# my_gem.gemspec
require 'rake'

Gem::Specification.new do |s|
  s.name        = 'my_gem'
  s.version     = '0.0.1'
  s.date        = '2014-04-15'
  s.summary     = "Ma gem de communication !"
  s.description = "Ma gem pour dire salut à tous !"
  s.authors     = ["Alain ANDRE"]
  s.email       = 'contact@alain-andre.fr'
  s.files       = FileList['lib     .rb',
                  '[A-Z]*',
                  'test/   *'].to_a
  s.homepage    = 'http://rubygems.org/gems/my_gem'
  s.license     = 'MIT'
end
```

## Itération 3 : créer les tests unitaires.

Pour cela nous allons ajouter un fichier **Rakefile**, un dossier **test/** et notre fichier **test\_my\_gem.rb** dans l'architecture qui doit ressembler à ceci :

```bash 
# ls my_gem
my_gem
.
├── Rakefile
├── my_gem.gemspec
├── lib
│   └── my_gem.rb
└── test
    └── test_my_gem.rb
```

Le fichier **Rakefile** est constitué de la sorte :

```ruby 
# Rakefile
require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs << 'test'
end

desc "Run tests"
task :default => :test
```

Et le fichier **test/test\_my\_gem.rb** :

```ruby 
# test_my_gem.rb
require 'test/unit'
require 'MyGem'

class MyGemTest < Test::Unit::TestCase
  def test_base_salut
    assert_equal "Salut tout le monde !",
      MyGem.salut()
  end

  def test_salut_alain
    assert_equal "Salut à toi Alain !",
      MyGem.salut_qu("Alain")
  end

  end
```

On peut tester ça dans le dossier racine de my_gem :

```bash
$ rake test
```

Là on est bon, on a une gem pro. On peut changer la version et faire notre push.

Maintenant qu'on sait comment tout ça fonctionne, on va pouvoir [aller plus loin][4] et utiliser **bundler** :p

 [1]: http://guides.rubygems.org/
 [2]: http://guides.rubygems.org/specification-reference
 [3]: http://guides.rubygems.org/name-your-gem/
 [4]: http://www.alain-andre.fr/?p=1711
