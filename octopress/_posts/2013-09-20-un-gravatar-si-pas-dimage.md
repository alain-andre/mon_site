---
title: Un gravatar si pas d'image
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-09-20 13:06:36 +0200
categories:
  - Ruby on Rails
tags:
  - gravatar
  - rails
---
J'ai une classe `Contact` qui possède un avatar (gérée avec paperclip et le S3 d'Amazon). Mes contacts sont enregistrés lors de la validation de leur adresse e-mail; c'est l'unique champ utilisé pour la création. Je n'ai donc pas d'image disponible lors du premier affichage de leur profil sur le panel utilisé pour la modification. Étant donné que j'ai leur adresse e-mail, je veux afficher leur image [Gravatar][1] -Globally Recognized Avatar-

Ma fonction appelée par mon contrôleur retourne un json afin d'afficher en ajax les informations dans le template HTML :

```ruby 
# Fonction get_contact
def get_contact
    @contact = Contact.where(user_id: current_user.id, id: params[:id]).first
    if @contact then
      @result = 1
      @message = t('message.get_contact_ok')
    else
      @result = 2
      @message = t('message.get_contact_empty')
    end
    render 'ajax/getContact'
  end
```

J'ai donc modifié la fonction afin qu'elle teste la présence d'une image et que si elle est absente retourne le Gravatar du contact. Pour cela je me base sur la [doc ruby][3] proposée par gravatar:

```ruby 
# Fonction get_contact
def get_contact
    @contact = Contact.where(user_id: current_user.id, id: params[:id]).first
    if @contact then
      if @contact.image.url.include? 'missing' then
        # include MD5 gem, should be part of standard ruby install
        require 'digest/md5'
        # get the email from URL-parameters or what have you and make lowercase
        email_address = @contact.mail.downcase
        # create the md5 hash
        hash = Digest::MD5.hexdigest(email_address)
         # compile URL which can be used in <img src="RIGHT_HERE"...
        @image = "http://www.gravatar.com/avatar/#{hash}"
      else
        @image = @contact.image.url
      end
      @result = 1
      @message = t('message.get_contact_ok')
    else
      @result = 2
      @message = t('message.get_contact_empty')
    end
    render 'ajax/getContact'
  end
```

J'ai aussi modifié mon **template rabl** afin qu'il passe l'`@image` dans le noeud approprié.

 [1]: http://fr.gravatar.com/
 [3]: http://fr.gravatar.com/site/implement/images/ruby/
