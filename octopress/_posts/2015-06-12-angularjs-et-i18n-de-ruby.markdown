---
layout: post
title: "Angularjs Et I18n De Ruby"
date: 2015-06-12T16:55:15+02:00
comments: true
categories: 
  - angularjs
  - Ruby on Rails
tags :
  - i18n
---

[Montrail](http://monterail.com) a une façon vraiment géniale de gérer l'internationalisation de leurs applications AngularJS avec Rails. Ils utilisent un fichier `json` sous `app/assets/locales/locales/` utilisé par Angular-translate qui est généré à partir des fichiers `yml` habituels de *I18n*.

Afin de recharger le cache lors de la modification du fichier yml dans le dossier `config/locales` de Rails, la directive [depend_on](https://github.com/sstephenson/sprockets#the-depend_on-directive) de sprockets.

```erb
// app/assets/locales/locales/en.json.erb
//= depend_on_config locales/en.yml
<%= Translations.new.for(:en).to_json %>
```

Ci-dessous le fichier [Translations](https://github.com/monterail/angularjs-and-rails-marriage/blob/master/app/services/translations.rb) qui permet d'aplatir le fichier `yml` afin d'être transcrit en json pour AngularJS.

```ruby
# /app/services/translations.rb
class Translations
  class InvalidLocale < RuntimeError; end

  def initialize(locales = I18n.available_locales)
    @available_locales = locales.map(&:to_s)
  end

  def for(lang)
    raise InvalidLocale, "#{lang} is not supported" unless valid_locale?(lang.to_s)

    I18n.backend.send(:init_translations)
    hash = I18n.backend.send(:translations)[lang.to_sym]
    flatten_hash(hash)
  end

  private

  attr_reader :available_locales

  def valid_locale?(lang)
    available_locales.include?(lang)
  end

  def flatten_hash(hash, parent = [])
    hash.flat_map do |key, value|
      if value.is_a?(Hash)
        flatten_hash(value, parent + [key])
      else
        {(parent + [key]).join('.') => value}
      end
    end.inject({}, :merge)
  end
end
```

Il reste  à ajouter dans le fichier `config/initializers/sprockets.rb` afin que rails prenne en compte la class **Translations**.

```ruby
# add custom depend_on_config sprockets processor directive
class Sprockets::DirectiveProcessor
  def process_depend_on_config_directive(file)
    path = File.expand_path(file, Rails.root.join('config'))
    context.depend_on(path)
  end
end

# register .json for assets pipeline
Rails.application.assets.register_mime_type 'application/json', '.json'

# enable to use sprockets directive processor in .json
Rails.application.assets.register_preprocessor 'application/json', Sprockets::DirectiveProcessor
```

ainsi que la ligne suivante dans le fichier `config/application.rb`

```ruby
require "sprockets/railtie"
```

Finalement, toutes vos données I18 sont accéssibles dans vos `app/assets/templates` de la façon suivante : 

```haml
%p{ "translate" => 'hello' } 
```