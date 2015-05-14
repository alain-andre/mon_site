---
title: Faire tourner paperclip en background
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-09-19 18:06:36 +0200
categories:
  - Amazon Web Services
  - Heroku
  - Ruby on Rails
tags:
  - delayed job
  - paperclip
  - worker
---
Afin d'éviter des [time-out][1] lors du chargement d'images via [paperclip][2] il faut créer un [**worker**][3] sur notre serveur qui va se charger des tâches de redimensionnement et d'upload de façon à libérer notre **dyno** web.

Divers posts très intéressants proposent des solutions; j'en ai retenu trois :

*   L'[article][4] d'Aaron Van Bokhoven.
*   Le post [DJ][5] d'Heroku sur la façon d'utiliser PostgreSQL afin de différer l’exécution de tâches.
*   Le post [queuing-ruby-resque][6] d'Heroku utilisant [resque][7]

La méthode d'Aaron m'a beaucoup plu mais elle demande de modifier le plugin paperclip, ce qui me pose des inquiétudes quand à la longévité de la **compatibilité**. les DJ sont vraiment super, simple de mise en place il permettent de gérer les queues de façon assez simple (vu qu'il s'agit de la DB) mais au bout de **30000 jobs**, les performances se font sentir. Resque a été créé pour faire du DJ mais en [mieux][8]. Le problème de Resque à mes yeux est la **complexité de mise place** -pas insurmontable- comparé à DJ. Pour le moment mon application ne gère pas plus de 30000 jobs en même temps alors je verrais à passer à Resque le moment venu. Je choisi donc d'utiliser DJ pour mes jobs en background.

La mise en place de DJ est rapide. On commence par ajouter `gem 'delayed_job_active_record'` à notre Gemfile. Attention, avec **Rails 4** si vous utilisez `protected_attributes`, elle doit être appelée avant `delayed_job_active_record`:

```ruby
gem 'pg'
gem 'protected_attributes' # <== avant delayed_job_active_record
gem 'delayed_job_active_record' # background jobs
gem 'rolify'
gem 'sendgrid'
```

Puis on demande à rails de nous lier tout ça à ActiveRecord :

```bash
$ rails generate delayed_job:active_record
  create  bin/delayed_job
   chmod  bin/delayed_job
  create  db/migrate/20130919141015_create_delayed_jobs.rb
$ rake db:migrate
==  CreateDelayedJobs: migrating ==============================================
-- create_table(:delayed_jobs, {:force=>true})
   -> 0.5369s
-- add_index(:delayed_jobs, [:priority, :run_at], {:name=>"delayed_jobs_priority"})
   -> 0.1201s
==  CreateDelayedJobs: migrated (0.6572s) =====================================
```

Puis on modifie notre fichier **Procfile** en lui ajoutant le process à exécuter pour notre/nos worker :

```
worker:  bundle exec rake jobs:work
```

Et voilà !! oui c'est vrais c'est fini. On démarre le serveur avec [foreman][9]. Pour votre serveur de production, n'oubliez pas de créer le [nombre de worker][10] qu'il vous faut.

```bash
$ foreman start
16:13:13 web.1    | started with pid 3829
16:13:13 worker.1 | started with pid 3831
16:13:14 web.1    | I, [2013-09-19T16:13:14.047524 #3832]  INFO -- : Refreshing Gem list
16:13:15 web.1    | I, [2013-09-19T16:13:15.905048 #3832]  INFO -- : listening on addr=0.0.0.0:5000 fd=8
16:13:15 web.1    | I, [2013-09-19T16:13:15.928330 #3891]  INFO -- : worker=0 ready
16:13:15 web.1    | I, [2013-09-19T16:13:15.929936 #3832]  INFO -- : master process ready
16:13:15 web.1    | I, [2013-09-19T16:13:15.930476 #3894]  INFO -- : worker=1 ready
16:13:15 web.1    | I, [2013-09-19T16:13:15.934186 #3897]  INFO -- : worker=2 ready
20:30:22 worker.1 | [Worker(host:alain-AO751h pid:4041)] Job DelayedPaperclip::Jobs::DelayedJob (id=1) COMPLETED after 38.8487
20:30:22 worker.1 | [Worker(host:alain-AO751h pid:4041)] 1 jobs processed at 0.0253 j/s, 0 failed
20:30:22 worker.1 | [Worker(host:alain-AO751h pid:4041)] Job DelayedPaperclip::Jobs::DelayedJob (id=2) RUNNING
20:30:37 worker.1 | [Worker(host:alain-AO751h pid:4041)] Job DelayedPaperclip::Jobs::DelayedJob (id=2) COMPLETED after 36.5383
20:30:37 worker.1 | [Worker(host:alain-AO751h pid:4041)] Job DelayedPaperclip::Jobs::DelayedJob (id=3) RUNNING
```

Il nous suffit maintenant de configurer nos modèles. Toutes les actions que l'on veut différer prennent un *delay* avant leur appel.

```ruby 
#Delay d'un envoie de mail du model Friend
Friend.delay.send_mail
```

Il est aussi possible de directement modifier une fonction que l'on a écrite dans notre `model` comme le présente le [readme][11] de DJ. Ici la fonction `deliver` de la classe `Device` doit toujours tourner en background.

```ruby
class Device
  def deliver
    # long running method
  end
  handle_asynchronously :deliver
end

device = Device.new
device.deliver
```

Tout ceci fonctionne parfaitement pour nos mails mais pas pour paperclip. On obtient un message d'interdit lors de la tentative d'affichage de l'image. Mais heureusement en cherchant un peu on trouve une gem magique : [DelayedPaperclip][12]. Pour l'installer on ajoute `gem install delayed_paperclip` après notre gem DJ comme ceci.

```ruby
gem 'protected_attributes'
gem 'delayed_job_active_record' # background jobs
gem "delayed_paperclip", "~> 2.6.1"
```

Au lieu d'utiliser la méthode `delay` d'un model ActiveRecord, on va ajouter à notre modèle `Friend` créé lors du tutoriel sur paperclip une ligne un peu comme le `handle_asynchronously :deliver` qui prenait en argument une méthode sauf que là elle prend un champ.

```ruby
process_in_background :avatar
```

La log du worker lors d'un upload réussit :

```bash
[Worker(host:alain-p6715fr pid:8533)] Job DelayedPaperclip::Jobs::DelayedJob (id=47) RUNNING
[Worker(host:alain-p6715fr pid:8533)] Job DelayedPaperclip::Jobs::DelayedJob (id=47) COMPLETED
  after 10.0308
[Worker(host:alain-p6715fr pid:8533)] 1 jobs processed at 0.0989 j/s, 0 failed
```

La log du worker lors d'un upload en échec :

```bash
[Worker(host:alain-p6715fr pid:8533)] Job DelayedPaperclip::Jobs::DelayedJob (id=48) RUNNING
[Worker(host:alain-p6715fr pid:8533)] Job DelayedPaperclip::Jobs::DelayedJob (id=48) FAILED
  (0 prior attempts) with NoMethodError: undefined method '[]' for nil:NilClass
[Worker(host:alain-p6715fr pid:8533)] 1 jobs processed at 18.7353 j/s, 1 failed
```

 [1]: http://www.alain-andre.fr/blog/2013/09/18/gerer-les-timeouts-de-rails-sur-heroku/
 [2]: https://github.com/thoughtbot/paperclip
 [3]: https://devcenter.heroku.com/articles/background-jobs-queueing
 [4]: http://aaronvb.com/articles/15-paperclip-amazon-s3-background-upload-using-starling-and-workling
 [5]: https://devcenter.heroku.com/articles/delayed-job#setting-up-delayed-job
 [6]: https://devcenter.heroku.com/articles/queuing-ruby-resque
 [7]: https://github.com/resque/resque
 [8]: https://github.com/blog/542-introducing-resque
 [9]: https://devcenter.heroku.com/articles/procfile
 [10]: https://devcenter.heroku.com/articles/scaling
 [11]: https://github.com/collectiveidea/delayed_job
 [12]: https://github.com/jrgifford/delayed_paperclip
