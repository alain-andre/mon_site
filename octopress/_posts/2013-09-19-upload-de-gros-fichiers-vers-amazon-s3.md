---
title: Upload de gros fichiers vers Amazon S3
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-09-19 23:06:36 +0200
categories:
  - Amazon Web Services
  - Ruby on Rails
tags:
  - aws
  - s3
---
Pour uploader de gros fichiers, il est préférable d'envoyer directement le formulaire au S3 d'Amazon dont le retour nous serra envoyé sur une url donnée (ici *upload_image* que vous aurez configuré dans votre *config/routes*). Cette méthode a un **désavantage face à paperclip** car il nous faut tout gérer tout seul : le dimensionnement n'est pas fait, l'enregistrement dans notre table non plus. Mais nous permet de ne pas se soucier des *dynos disponibles* sur notre serveur Heroku.

Ceci pose évidement une question critique : la sécurité. Comment savoir si un utilisateur ne va pas hacker notre formulaire pour envoyer des images ou autre chose sur notre espace de stockage ? Heureusement Amazon a pensé à tout. Le formulaire contient une **police** et une **signature** validant l'origine et le type de contenu.

On va commencer par créer la police dans notre controller afin de l'utiliser dans la vue qui affiche le formulaire. La police est une collection de propriétés écrites à la façon d'objet JavaScript. Il contient deux parties : *expiration* qui définit la date de fin de la validité du formulaire (nous générerons donc la date du jour+1 à chaque appel), et *conditions* qui définit tous les champs qui doivent être corroborés dans le formulaire HTML à l'exception de `AWSAccessKeyId`, `signature`, `policy` et `file`. Cf. la &#91;doc&#93;&#91;2&#93; Amazon.

```ruby
require 'base64'
require 'openssl'
require 'digest/sha1'

tomorrow = DateTime.now.tomorrow.to_default_s # 2013-09-13T10:09:37+02:00
@upload_image = url_for controller: 'friend', action: 'upload_image', host: request.host, locale: I18n.locale
policy_document = <<-END
{"expiration": #{tomorrow},
  "conditions": [
    {"bucket": #{ENV['AWS_BUCKET']}},
    ["starts-with", "$key", "uploads/"],
    {"acl": "private"},
    {"success_action_redirect": '#{@upload_image}'},
    ["starts-with", "$Content-Type", "image"],
    ["content-length-range", 0, 1048576]
  ]
}
END

@policy = Base64.encode64(policy_document).gsub("n","")

@signature = Base64.encode64(
    OpenSSL::HMAC.digest(
        OpenSSL::Digest::Digest.new('sha1'),
        ENV['AWS_SECRET_ACCESS_KEY'], @policy)
    ).gsub("n","")
```

Nous allons pouvoir utiliser notre formulaire (ici en [simple_form](https://github.com/plataformatec/simple_form)) dans la vue appellée par notre controller :

```ruby
<%= simple_form_for @friend, url: "#{ENV['AWS_BUCKET']}.s3.amazonaws.com" do |f| %>
  <%= f.hidden_field :key, :value => "uploads/" %>
  <%= f.hidden_field :AWSAccessKeyId, :value => ENV['AWS_ACCESS_KEY_ID'] %>
  <%= f.hidden_field :acl, :value => "private" %>
  <%= f.hidden_field :success_action_redirect, :value => @upload_image %>
  <%= f.hidden_field :policy, :value => @policy %>
  <%= f.hidden_field :signature, :value => @signature %>
  <%= f.hidden_field :Content-Type, :value => "image" %>
  <%= f.file_field :avatar %>
  <%= f.button :submit %>
<% end %>
```

Le controller recevant la redirection doit alors enregistrer les informations dans notre table friends.
