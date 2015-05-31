---
layout: post
author: Alain ANDRE
title: "Configurer Rails avec AngularJS"
date: 2015-01-23 20:13:10 +0100
comments: true
categories: 
  - Ruby on Rails
  - angularjs
tags :
  - angular
  - webapp
---

Ce post est lié à ma tentative de créer un [Générateur Angular on Rails](ruby%20on%20rails/2014/06/26/un-generateur-angular-on-rails/)

[Monterail](http://monterail.com/) utilise [rails-assets](https://rails-assets.org/) afin de charger les gems *lodash*, *angular*, *angular-cache*, *angular-ui-router* et *angular-translate* issues de [Bower](http://bower.io). Pour cela, il suffit d'ajouter dans le *Gemfile* la ligne `source 'https://rails-assets.org'` ainsi que les appels aux gems de rails-asset de cette façon : `gem 'rails-assets-BOWER_PACKAGE_NAME'`.

```ruby 
# Gemfile
source 'https://rubygems.org'
source 'https://rails-assets.org'

# etc ..

# assets
gem 'rails-assets-lodash'
gem 'rails-assets-angular',                       '~> 1.2.0'
gem 'rails-assets-angular-cache'
gem 'rails-assets-angular-ui-router',             '~> 0.2.9'
gem 'rails-assets-angular-translate'
```

# Le passage de constantes
## templates
Il faut passer à AngularJS la liste des fichiers qui doivent être pris en compte pour des templates. Pour cela, nous créons une fonction `templates` qui va chercher dans le répertoire assets tous le fichiers `swf`, `html` ou encore `json`.

```ruby 
# lib/templates_paths.rb
module TemplatesPaths
  extend self

  def templates
    Hash[
      Rails.application.assets.each_logical_path.
      select { |file| file.end_with?('swf', 'html', 'json') }.
      map { |file| [file, ActionController::Base.helpers.asset_path(file)] }
    ]
  end
end
```

## Le concern js_env
A partir de Rails4 il est possible d'écrire du code que l'on avait l'habitude de répéter dans divers fichiers en un seul *concern*. Pour plus de détails, un super article se trouve [ici](http://www.synbioz.com/blog/Rails_4_utilisation_des_concerns).

Ce fichier va permettre de passer les constantes Rails dans le code de notre application.

```ruby 
# app/controllers/concerns/js_env.rb
require 'templates_paths'

module JsEnv
  extend ActiveSupport::Concern
  include TemplatesPaths

  included do
    helper_method :js_env
  end

  def js_env
    data = {
      env: Rails.env,
      templates: templates
    }

    <<-EOS.html_safe
      <script type="text/javascript">
        shared = angular.module('SampleApp')
        shared.constant('Rails', #{data.to_json})
      </script>
    EOS
  end
end
```

L'application_controller peut maintenant inclure JsEnv qui sera disponible pour les fichiers de l'application.

```ruby 
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include JsEnv
end
```

La page `application.html` peut maintenant utiliser le helper `js_env`.

```haml 
# app/views/layouts/application.html.slim
body
  h1 Sample App Main Page
  = yield

  = javascript_include_tag 'application'
  = js_env
```

Le passage de l'environnement d’exécution passé dans le contrôleur de page.

```javascript 
// app/assets/javascripts/controllers/pages_ctrl.coffee
angular.module('SampleApp').controller 'PagesCtrl', ($scope, Rails) ->
  $scope.test = Rails.env
```

De façon à pouvoir utiliser slim dans les `app/assets/templates`, le fichier `sprockets.rb` prend les lignes suivantes :

```ruby 
# config/initializers/sprockets.rb
# register .slim for assets pipeline
Rails.application.assets.register_mime_type 'text/html', '.html'
Rails.application.assets.register_engine '.slim', Slim::Template
```

# AngularJS interceptors
AngularJS propose un array `$httpProvider.interceptors` qui permet d'ajouter des services qui vont intercepter les flux entre le client et le serveur dans un sens comme dans l'autre.

Grâce à un service que l'on va nommer `railsAssetsInterceptor`, les templates auront toujours le bon `path` (en prod comme en dev). Ce service va transformer par exemple un `/pages/index.html` en `/assets/pages/index.html` et vise-versa.

```javascript 
// app/assets/javascripts/init.coffee
angular.module('SampleApp').config ($provide, $httpProvider, Rails) ->
  # Assets interceptor
  $provide.factory 'railsAssetsInterceptor', ($angularCacheFactory) ->
    request: (config) ->
      if assetUrl = Rails.templates[config.url]
        config.url = assetUrl
      config

  $httpProvider.interceptors.push('railsAssetsInterceptor')
```
