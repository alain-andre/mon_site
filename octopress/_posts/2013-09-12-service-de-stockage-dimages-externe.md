---
title: Service de stockage d'images externe
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-09-12 12:09:16 +0200
categories:
  - Amazon Web Services
  - Ruby on Rails
tags:
  - fichiers externes
  - paperclip
  - s3
---
*Cet article est basé sur les excellents [paperclip-s3#configuration][1] et [Browser Uploads to S3][2] il ne couvre pas les détails mais pointe sur les éléments importants*

L'objectif de passer par un service de stockage externe est de rendre l'application plus rapide et plus sécurisée. En effet, la page avec ses scripts et ses CSS se chargera de votre serveur, mais les images seront elles chargées depuis un autre serveur. Personnellement, j’utilise [Paperclip][3] et le service d'Amazon [S3][4]. En plus d'externaliser l'accès aux images stockées, S3 permet de les stocker peu importe la taille pour un tarif attractif.

Pour cela il faut déjà avoir un compte S3 ([tutoriel][5]) et avoir créé un **Bucket** afin de stocker les images de nos clients. On doit ajouter les gems suivantes : [paperclip][6], [rmagick][7] (nécessite les paquets imagemagick et libmagickwand-dev sur les distros debian/ubuntu), [aws-sdk][8] dans le Gemfile.

Afin de spécifier à Paperclip que l'on utilise S3 comme service de stockage en production, on doit ajouter dans le fichier `config/environments/production.rb` les informations de sécurité. Je modifie aussi mon fichier `config/environments/development.rb` pour une validation en pre-prod.

```ruby 
#config/environments/production.rb
config.paperclip_defaults = {
  :storage => :s3,
  :s3_credentials => {
    :bucket => ENV['AWS_BUCKET'],
    :access_key_id => ENV['AWS_ACCESS_KEY_ID'],
    :secret_access_key => ENV['AWS_SECRET_ACCESS_KEY']
  },
  :s3_permissions => :private
}
```

Pour retrouver vos informations de sécurité, allez [ici][9]. Il suffit ensuite de configurer les variables d'environnement utilisées avec `heroku config:set`. Si vous utilisez [figaro][10] modifiez aussi votre fichier application.yml (Que vous avez **gitignore** évidement)

Ensuite dans le modèle il nous faut ajouter un champ *avatar*, ou *image* mais je vais rester calqué sur le tuto d'heroku. On utilise la fonction `has_attached_file` du helper de paperclip qui prend en argument des options de traitement pour ImageMagick :

```ruby 
#app/model/friend.rb
class Friend < ActiveRecord::Base

  # Associer l'attribut ":avatar" avec un fichier
  has_attached_file :avatar, styles: {
    thumb: '100x100>',
    square: '200x200#',
    medium: '300x300>'
  }

  validates_attachment_content_type :avatar, :content_type => /\Aimage\/(jpg|jpeg|pjpeg|png|x-png|gif)\z/, :message => I18n.t('avatar.file_type_not_allowed')
end
```

**Note**: Depuis rails 4.1, l'affectation massive n'est plus autorisée, on ne peut plus utiliser `attr_accessible :avatar` mais on doit ajouter une fonction privée dans le controller de ce model.

```ruby 
#app/controller/
class FriendsController < ApplicationController
  # 

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def friend_params
      params.require(:friend).permit(:nom, ..., :avatar)
    end
end
``` 

Les symboles `>` et `#` sont les options de redimensionnement d'ImageMagick. Allez sur leur [doc][11] pour savoir ce qu'il en est. Mais de façon abrégée :

    Ignorer les proportions ("!")
    Seulement rétrécir si plus gros (">")
    Seulement agrandir si plus petites ("<")
    Remplir la zone donnée ("^")
    Redimensionnement de pourcentage ("%")
    Limite de zone de pixels ("@")
    Recadrer la vignette au centre aux dimensions demandées ("#")


Reste à modifier la table. On va créer une migration `rails g migration addAvatarToFriends` qui va utiliser la fonction `add_attachment` du helper de migration.

```ruby
  class AddAvatarToFriends < ActiveRecord::Migration
    def change
      add_attachment :friends, :avatar
    end
  end
```

Ceci va ajouter les champs `avatar_file_name`, `avatar_file_size`, `avatar_content_type` et `avatar_updated_at` dans la table avatar qui seront automatiquement remplis lors d'un upload.

Notre application est prête à accueillir les données mais il nous reste à mettre en place le formulaire d’envois. Pour cela, il suffit de faire un [formulaire][12] tout simple vers notre controller qui se chargera d'enregistrer notre Friend.

```ruby
<%= form_for(@friend) do |f| %>
  <% if @friend.errors.any? %>
    <div id="error_explanation">
      <h2><%= pluralize(@friend.errors.count, "error") %> prohibited this friend from being saved:</h2>

      <ul>
      <% @friend.errors.full_messages.each do |msg| %>
        <li><%= msg %></li>
      <% end %>
      </ul>
    </div>
  <% end %>

  <div class="field">
    <%= f.label :name %>
    <%= f.text_field :name %>
  </div>
  <div class="field">
    <%= f.label :avatar %>
    <%= f.file_field :avatar %>
  </div>
  <div class="actions">
    <%= f.submit 'Make a friend' %>
    <%= link_to 'Nevermind', friends_path, class: 'button' %>
  </div>
<% end %>
```

Le tutoriel d'Heroku nous met en garde sur un possible timeout (si on a un **nombre limité de dynos** et de **gros volumes** -pas si gros en fait- à stocker) et donc un échec de notre upload. Pour les maîtriser et les tracer, suivez ce [post][13].

Une fois enregistrée via paperclip, cette image peut être appelée dans une vue avec une option d'affichage (ici :square) de la façon suivante :

```ruby
<%= image_tag friend.avatar.url(:square) %>
```

Afin d'éviter les timeouts, il est possible d'[uploader directement][14] vers le S3 d'Amazon, mais il est possible aussi de faire tourner notre [upload en background][15].

 [1]: https://devcenter.heroku.com/articles/paperclip-s3#configuration
 [2]: http://aws.amazon.com/articles/1434?_encoding=UTF8&jiveRedirect=1
 [3]: https://github.com/thoughtbot/paperclip
 [4]: http://aws.amazon.com/fr/s3/
 [5]: https://devcenter.heroku.com/articles/s3
 [6]: http://rubydoc.info/gems/paperclip/frames
 [7]: http://rubydoc.info/gems/rmagick/frames
 [8]: http://rubydoc.info/gems/aws-sdk/frames
 [9]: https://portal.aws.amazon.com/gp/aws/securityCredentials
 [10]: http://rubydoc.info/gems/figaro
 [11]: http://www.imagemagick.org/Usage/resize/#shrink
 [12]: https://github.com/thoughtbot/paperclip_demo/blob/master/app/views/friends/_form.html.erb
 [13]: http://www.alain-andre.fr/blog/2013/09/18/gerer-les-timeouts-de-rails-sur-heroku/
 [14]: http://www.alain-andre.fr/blog/2013/09/19/upload-de-gros-fichiers-vers-amazon-s3/
 [15]: http://www.alain-andre.fr/blog/2013/09/19/faire-tourner-paperclip-en-background/
