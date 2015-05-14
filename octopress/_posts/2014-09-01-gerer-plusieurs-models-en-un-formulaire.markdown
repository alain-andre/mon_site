---
layout: post
author: Alain ANDRE
title: "Gérer plusieurs models avec un seul formulaire"
date: 2014-09-01 14:20:35 +0200
comments: true
published: true
categories:
  - Ruby on Rails
tags :
  - nestedattributes
  - simple_form
  - cocoon
---

La gestion des formulaires sous rails est tout simplement magique. Mais qu'en est-il lorsque nous avons une liaison avec un autre modèle ?

Dans cet article, nous allons voir comment gérer en un seul formulaire plusieurs modèles. Nous allons nous atteler à la création d'un questionnaire (Survey).

## Déclarations de nos modèles et accès aux attributs
Afin d'éviter d'avoir à trop tenir compte dans notre contrôleur *SurveysController* des sous-modèles (Questions, Answers) contenus dans notre modèle principal (Survey), nous allons utiliser les [NestedAttributes](http://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html) d'ActiveRecord.

```ruby 
# app/models/participant.rb
class Participant < ActiveRecord::Base
  has_many :answers
  has_many :questions, through: :answers
end
```

```ruby 
# app/models/survey.rb
class Survey < ActiveRecord::Base
  has_many :questions

  accepts_nested_attributes_for :questions, :reject_if => :all_blank, :allow_destroy => true
end
```

```ruby 
# app/models/question.rb
class Question < ActiveRecord::Base
  belongs_to :survey
  has_many :answers
  has_many :participants, through: :answers

  accepts_nested_attributes_for :answers
end
```

```ruby 
# app/models/answer.rb
class Answer < ActiveRecord::Base
  belongs_to :participant
  belongs_to :question
end
```

Les paramètres `reject_if` et `allow_destroy` vont nous garantir qu'une question de serra pas créée si ses informations sont vides et pourra être supprimée par le même biais qu'elle a été créée. si nous n'utilisions pas les NestedAttributes, l'action `create` devrait au moins avoir une ligne comme celle-ci pour créer une question.

```ruby 
# app/controllers/surveys_controller.rb
def create
  ...
  @question = @survey.questions.build(params[:question])
  ...
end
```

Nous allons modifier notre contrôleur de la façon suivante : ajouter les attributs dans la whitelist et créer l'action answers (notre model de jonction).
```ruby 
# app/controllers/projects_controller.rb

before_action :set_survey, only: [:show, :edit, :update, :destroy, :answers]

def answers
  @participants = Participant.all
  @questions = @survey.questions
end

private
  # whitelist
  def survey_params
    params.require(:survey).permit(:name,
      :questions_attributes => [:id, :content,
        :answers_attributes => [:id, :content, :participant_id]
      ])
  end
```

Notez dans la whitelist le `questions_attributes` qui contient le `answers_attributes` car nous passons par le model Answer pour trouver nos Questions ou nos Participants (le through).

## La route
Vous avez remarqué que notre contrôleur possède une fonction `answers` qui appèle `set_survey`. Ceci n'est pas une action RESTful et ne fonctionne pas comme ça. Nous devons donc la définir comme tel dans nos routes gràce à [on: :member](http://guides.rubyonrails.org/routing.html#adding-more-restful-actions)

```ruby 
# config/routes.rb

resources :surveys do
  get 'answers', on: :member
end
resources :participants
```

## Les vues
Une vue simple mais qui explique bien comment tout ceci fonctionne de base serrait :

```ruby 
# app/views/surveys/_form.html.haml

= form_for(@survey) do |f| %>
  = @participants.each do |participant|
    %h3= participant.name
    = @questions.each do |question|
      = question.content
      = f.fields_for :questions, question do |q|
        = q.fields_for :answers, question.answers.find_or_initialize_by(participant: participant) do |a|
          = a.text_area :content
          = a.hidden_field :participant_id, participant.id
  = f.submit
```

## Pour une interaction plus active
[Cocoon](https://github.com/nathanvda/cocoon) nous livre deux méthodes `link_to_add_association` et `link_to_remove_association` qui permettent d'ajouter et de supprimer un sous-modèle. Pour fonctionner, cette Gem a besoin d'un Partial nommé `_[sousModel]_fields.html.haml` pour afficher les sous-modèles.

Ce qui donne dans notre cas les Partials suivants. Je vous réfère à la documentation pour connaître les détails des paramètres que l'on peut passer aux méthodes [link_to_add_association](https://github.com/nathanvda/cocoon/#link_to_add_association) et [link_to_remove_association](https://github.com/nathanvda/cocoon/#link_to_remove_association).

```haml 
# app/views/surveys/_form.html.haml

= form_for(@survey) do |f| %>
  = @participants.each do |participant|
    %h3= participant.name
    = @questions.each do |question|
      = question.content
      = f.fields_for :questions, question do |q|
        = q.fields_for :answers, question.answers.find_or_initialize_by(participant: participant) do |a|
          = render 'answer_fields', :a => answers
          = link_to_add_association 'add answer', a, :answers
  = f.submit
```

```haml 
# app/views/surveys/_answer_fields.html.haml
= a.text_area :content
= a.hidden_field :participant_id, participant.id
= link_to_remove_association "remove answer", a
```

## Lier un projet à une personne déjà existante ?
Imaginons que vos projets aient un utilisateur référent (un Owner). Nous devrions pouvoir sélectionner lors du `link_to_add_association` une personne déjà existante. Et bien c'est possible comme ceci :

```ruby

    = f.association :owner, :collection => Person.all(:order => 'name'), :prompt => 'Choose an existing owner'
  = link_to_add_association 'add a new person as owner', f, :owner
```

## Sources
[railsforum](http://archive.railsforum.com/viewtopic.php?id=717)
[cocoon](https://github.com/nathanvda/cocoon/)
[createdbypete](http://www.createdbypete.com/articles/working-with-nested-forms-and-a-many-to-many-association-in-rails-4/)
