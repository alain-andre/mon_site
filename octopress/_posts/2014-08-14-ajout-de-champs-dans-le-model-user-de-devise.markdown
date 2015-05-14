---
layout: post
author: Alain ANDRE
title: "Ajout de champs dans le model User de Devise avec Rails 4"
date: 2014-08-14 23:49:33 +0200
comments: true
categories: [Ruby on Rails]
tags: [devise, rails 4, custom field]
---

Depuis que Rails 4 n'autorise plus l'**attr_accessor** que l'on ajoutait dans le *Model*, il nous faut configurer dans le *Controller* les champs qui seront persistants.

Pour ajouter par exemple un nom à nos Users, il nous faut donc créer une migration tel que ci-dessous.

```ruby 
# db/migrate/xxxxxxxxxxxxx_add_name_to_users.rb
class AddNameToUsers < ActiveRecord::Migration
  def change
    add_column :users, :name, :string
  end
end
```

Puis créer un controller qui va hériter d'un controller de Devise pour gérer nos enregistrements et mises à jour. Nous allons alors modifier les fonctions privées qui sont utilisées par le controller pour collecter les informations requises à la création ou la mise à jour d'un User.

```ruby 
# app/controllers/registrations_controller.rb
class RegistrationsController < Devise::RegistrationsController
 
  private
    def sign_up_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
   
    def account_update_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :current_password)
    end
end
```

Il nous reste maintenant à modifier le fichier *routes* pour que notre controller soit pris en compte.

```ruby 
#config/routes
devise_for :users, :controllers => { registrations: 'registrations' }
```

Voilà !!