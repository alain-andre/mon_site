---
title: 'ActiveRecord et json : ajouter des noeuds'
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-09-07 20:16:16 +0200
categories:
  - Ruby on Rails
tags:
  - générer json
  - rails
---
J'avais besoin d'avoir un **json** en sortie de ma requête **ActiveRecord**. Pour cela il suffit d'utiliser la méthode `.to_json` disponible en Ruby. Mais les choses ne sont jamais aussi simple -ou presque-. Il me fallait **imbriquer un nœud** qui ne faisait pas partie du modèle.

Prenons un exemple simple: un utilisateur peut écrire plusieurs posts.

```ruby
class User < ActiveRecord::Base
  attr_accessible :label, :description
  has_many :user_posts
  has_many :posts, through: :user_posts
end

class Post < ActiveRecord::Base
  attr_accessible :title, :text
  has_many :posts, through: :user_posts
end

class UserPost < ActiveRecord::Base
  belongs_to :user
  belongs_to :post
end
```

Et je veux récupérer les utilisateurs avec un champs nommé `posts_count` qui donne le nombre de posts d'un utilisateur. Il n'est possible de mettre ce champs ni dans le modèle, ni dans le schéma. J'ai pensé ajouter un champs dans l'array retourné mais ce n'est vraiment pas simple, je ne parle même pas de l'insertion d'éléments complexes.

Finalement après pas mal de recherches, j'ai trouvé une façon simple de faire : utiliser la gem [RABL][1]. RABL est un système de template qui permet de générer des jsons complexes tels qu'utilisés pour des APIs. Avec RABL il suffit donc de faire un `render` dans le contrôleur appelé vers une template en `.rabl`. Personnellement je les met dans un dossier `views/ajax`.

Pour obtenir un joli json de nos utilisateurs avec le nombre de posts qu'ils ont écrit il suffit alors d'écrire dans le contrôleur :

```ruby
def get_users
  @users = User.all
  if @users then
    @result = 1
    @message = 'liste des utilisateurs avec le nombre de posts'
  else
    @result = 0
    @message = 'Aucun utilisateur enregistré'
  end
  render 'ajax/getUsers'
end
```

Et notre fichier `getUsers.rabl`

```ruby
node(:result){ @result }
node(:message){ @message }
child(@users => : objects){
  attributes *@users.class.column_names
  node(:posts_count){ |user| user.posts.count }
}
```

NB: j'utilise `*@users.class.column_names` pour afficher tous les champs; si on ne veut que des champs en particulier, il faut les lister de la façon suivante : `:id, :label`

Et ce superbe template nous retourne notre json :

```ruby
{"result":1, "message":"liste des utilisateurs avec le nombre de posts"
,"objects":{
  "users":[
    {"id":1, "label":"monsieur 1", "posts_count":2}
    ,{"id":1, "label":"monsieur 2", "posts_count":0}
  ]
}}
```

 [1]: http://rubydoc.info/gems/rabl/
