---
layout: post
author: Alain ANDRE
title: "Une API avec grape"
date: 2015-02-02 18:23:00 +0100
comments: true
published: true
categories: 
  - Ruby on Rails
tags :
  - ruby
  - rails
  - webapp
---
[Grape](https://github.com/intridea/grape) est un framework qui permet de créer des APIs REST. [Monterail](http://monterail.com) met à disposition sur son [blog](http://codetunes.com/2014/introduction-to-building-apis-with-grape/) son expérience sur le développement d'une telle API et c'est vraiment sympa car il est difficile de trouver un guide sur comment faire; la [documentation](https://github.com/intridea/grape#basic-usage) de grape n'est pas vraiment accessible à première vue, mais une fois compris le principe ci-dessous, elle est très complète et utile (comme toute doc. d’ailleurs).

# Installation
Tout normalement après l'ajout de la gem, on met à jour le bundle.

```ruby 
# Gemfile
gem "grape"
```

# Structure du code
Afin d'obtenir une réponse à l'url `/api/v1/objet.json`, il suffit de créer/modifier 4 fichiers.

Tout d'abord, le contrôleur qui va définir les actions à faire lors de la réception d'une requête restful. Il est aussi possible de créer des fonctions de helpers.

Ce qui est important de comprendre ici est la partie liée au helper `objet_params` qui va dans cet exemple être utilisé dans la partie **update** de l'objet. Le bloc `params do` va dans cette fonction déterminer les paramètres requis et ceux optionnels qui seront disponibles dans le bloc `put` via le helper `objet_params`. Pour toute information sur l'utilisation les paramètres, la [documentation](https://github.com/intridea/grape#parameters) est complète.

```ruby
# app/controllers/api/v1/objets.rb
module API
  module V1
    class Objets < Grape::API
      version 'v1' # path-based versioning by default
      format :json # We don't like xml anymore
      
      helpers do
        # Never trust parameters from the scary internet, only allow the white list through.
        def objet_params
          declared(params, include_missing: false)
        end
      end

      resource :objets do
        desc "Return list of objets"
          get do
            Objet.all # obviously you never want to call #all here
          end

        desc "Update a objet."
          params do
            requires :id, type: String, desc: "Objet ID."
            requires :objet, type: String, desc: "Your objet."
            optional :
          end
          put ':id' do
            authenticate!
            Objet.find(params[:id]).update(objet_params)
          end
      end
    end
  end
end
```

Ensuite le contrôleur d'association des APIs d'une même version. On met dans cette classe de Base toutes las APIs V1 de notre serveur. 

```ruby 
# app/controllers/api/v1/base.rb
module API
  module V1
    class Base < Grape::API
      mount API::V1::Objets
      mount API::V1::Wings
    end
  end
end
```

Il reste à associer les APIs des différentes versions.

```ruby 
# app/controllers/api/base.rb
module API
  class Base < Grape::API
    mount API::V1::Base
    mount API::V2::Base
  end
end
```

Et finalement le fichier `routes` qui donne accès aux APIs. 

Si jamais vous obtenez à l'exécution de votre code une erreur du type `Circular dependency detected while autoloading constant Api::V1::`, assurez vous que la route est bien définie comme ci-dessous.

```ruby 
# config/routes.rb
Rails.application.routes.draw do
  # ...
  mount API::Base => '/api'
  # ...
end
```

# Shared

Afin d'éviter la duplication de code, il est possible de créer un fichier à inclure dans les fichiers APIs.
Par exemple au lieu de mettre `version 'v1'` et `format :json` dans chaque fichier, il suffit de mettre `include API::V1::Defaults`.

```ruby 
# app/controllers/api/v1/objets.rb
module API
  module V1
    class Objets < Grape::API
      include API::V1::Defaults
```

Le fichier `defaults.rb` ajoute entre autre des gestions d'exceptions.

```ruby 
# app/controllers/api/v1/defaults.rb
module API
  module V1
    module Defaults
      # if you're using Grape outside of Rails, you'll have to use Module#included hook
      extend ActiveSupport::Concern

      included do
        # common Grape settings
        version 'v1' # path-based versioning by default
        format :json # We don't like xml anymore

        # global handler for simple not found case
        rescue_from ActiveRecord::RecordNotFound do |e|
          error_response(message: e.message, status: 404)
        end

        # global exception handler, used for error notifications
        rescue_from :all do |e|
          if Rails.env.development?
            raise e
          else
            Raven.capture_exception(e)
            error_response(message: "Internal server error", status: 500)
          end
        end

        # HTTP header based authentication
        before do
          error!('Unauthorized', 401) unless headers['Authorization'] == "some token"
        end
      end
    end
  end
end
```