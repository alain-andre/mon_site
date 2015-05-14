---
title: Générer des PDF avec wkhtmltopdf sur Heroku
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-10-23 01:06:36 +0200
categories:
  - Heroku
  - Ruby on Rails
tags:
  - heroku
  - pdf
  - wkhtmltopdf
---
Pour générer des PDF avec Ruby, on trouve un nombre important de possibilités, des gems permettant d'écrire un PDF en utilisant le langage Ruby ainsi que des add-ons payantes permettant de faire un nombre divers d'actions (dont la création) sur des PDFs.

En regardant de plus près et en cherchant un petit peu quand même, on s’aperçoit qu'il est possible de générer des PDF à partir de pages HTML sans avoir à débourser. Mais évidement ça demande un peu de travail. On trouve notamment [pdfkit][1] ainsi que [wicked_pdf][2] qui utilisent [wkhtmltopdf][3] (un shell de conversion basé sur webkit).

Bien heureusement Heroku nous propose une gem officielle : [wkhtmltopdf-heroku][4] qui va nous éviter une compilation (possiblement laborieuse) sur notre serveur via un des [Buildpack][5] proposés. Il nous faut aussi installer wkhtmltopdf en local avec la commande `sudo apt-get install wkhtmltopdf`. Une fois installé en local on va créer un lien symbolique vers `/usr/local/bin/wkhtmltopdf` ce qui nous permettra de ne pas se prendre la tête avec le fichier de configuration pour Heroku. NB: si le **wkhtmltopdf** que vous avez installé vous pose des soucis pour afficher les **headers** ou **footers**, il y a une solution [ici][6].

On va commencer par trouver notre binaire wkhtmltopdf installé en local

```bash
$ sudo locate wkhtmltopdf | grep bin
/home/alain/.rbenv/versions/2.0.0-p0/bin/wkhtmltopdf-linux-amd64
/home/alain/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/wkhtmltopdf-heroku-1.0.0/bin
/home/alain/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/wkhtmltopdf-heroku-1.0.0/bin/wkhtmltopdf-linux-amd64
/home/alain/.rbenv/versions/2.0.0-p0/lib/ruby/gems/2.0.0/gems/wkhtmltopdf-heroku-1.0.0/test/test_wkhtmltopdf_heroku_and_osx_binaries.rb
/usr/bin/wkhtmltopdf
```

Puis on crée le lien :

```bash
$ sudo ln -s /usr/bin/wkhtmltopdf /usr/local/bin/wkhtmltopdf
$ ls -l /usr/local/bin | grep wkhtmltopdf
lrwxrwxrwx 1 root root 20 oct. 20 23:18 wkhtmltopdf -> /usr/bin/wkhtmltopdf
```

Voilà, il nous reste maintenant à choisir une des gems d'intégration de wkhtmltopdf. Je laisse de côté `pdfkit`, pour choisir `wicked_pdf`. Je trouve cette gem plus proche de mes besoins. Tout d'abord parce-qu’il utilise de façon très naturelle les **templates** et qu'il comporte un nombre de modifications possibles du document assez impressionnant.

**wicked_pdf** :

Une fois la gem ajoutée au Gemfile et que vous avez fait le fameux `bundle install`, il vous reste à faire la génération de wicked_pdf

```ruby
$ rails g wicked_pdf
create config/initializers/wicked_prdf.rb
```

Ce fichier contient la direction vers le binaire wkhtmltopdf :

```ruby
WickedPdf.config = {
  :exe_path => '/usr/local/bin/wkhtmltopdf'
}
```

Nous allons le modifier afin de faire fonctionner notre application avec la version binaire que nous venons de mettre en place pour l'environnement de développement et laisser la configuration de la gem tel que en production.

```ruby
if Rails.env == "development"
  WickedPdf.config = {
    :wkhtmltopdf => '/usr/local/bin/wkhtmltopdf',
    :exe_path => '/usr/local/bin/wkhtmltopdf'
  }
 end
```

# Je vais présenter deux possibilités pour gérer le téléchargement du PDF généré

## En utilisant le stream

L'un des gros points forts de `wicked_pdf` est qu'il nous permet d'afficher un PDF sans générer de fichier que l'on ai à gérer. On pense tout de suite à un tag `<a href>` sauf qu'on a besoin de passer en `POST` des valeurs tels que le tocken d’authentification. Pour utiliser cette option, il nous suffit en fait de créer un formulaire sur notre page avec des `input` cachés que l'on rempliera en JavaScript et dont le bouton pointera vers le `controller` qui nous livre le PDF.

```html
<form method="post" action="/print_a">
  <input type="hidden" name="authenticity_tocken" />
  <input type="hidden" name="id" />
</form>
```

La fonction de notre `controller` (qui doit être disponible dans le fichier `routes.rb`) utilise l'option `:disposition` qui est ici ce qui rend possible le stream de notre vue `printA.pdf.html.erb` qui utilise `@a` pour remplir les champs avec les bonnes valeurs.

```ruby
def print_a
  @a = A.find(params[:id])
  render :pdf => @a.name,
    :template => "prints/printA.pdf.html.erb",
    :disposition => "attachment"
end
```

Notre JavaScript n'a plus qu'à modifier les valeurs des `input` de notre formulaire lors du chargement de la page.

Bien! Tout ceci est magnifique mais j'ai quelques problèmes :

*   Comment gère-t-on les erreurs retournées par le serveur si la génération se passe mal ?
*   Comment faire pour passer la génération du PDF à un [worker][7] ?

## En créant un fichier temporaire

Afin de **gérer les erreurs** lors d'une génération qui s'est mal déroulée, j'utilise le JavaScript et donc de l'AJAX. Personnellement lors d'une erreur XHR, j'ai une fonction JavaScript qui m'envoie une requête AJAX -oui une nouvelle- afin d'enregistrer l'erreur dans ma DB et de me faire parvenir un e-mail. Mais une requête AJAX ne permet pas de lancer la fenêtre d'enregistrement/ouverture de fichier du navigateur !

Il faut tricher un peu là. L'idée est de demander au `controller` de faire travailler `wicked_pdf` pour créer le PDF dans un fichier temporaire et de retourner un JSON contenant une URL publique du PDF.

### Côté JavaScript

Pour commencer, nous allons ajouter un `listener` sur notre bouton afin de lancer une requête AJAX pour notre `controller`. Cette partie n'est pas complexe et dépend du Framework que vous utilisez alors je ne l'écris pas. Tout ce qu'il faut faire c'est attraper le retour du serveur et selon le cas, lancer une erreur ou ouvrir le fichier passé dans le JSON avec la fonction JavaScript `windows.location.href = json.tempurl`.

### Côté controller (qui doit être disponible dans le fichier routes.rb)

On va générer notre PDF puis définir deux valeurs :

*   Notre fichier temporaire `@tempfile` qui se trouvera dans le dossier `/public` de notre serveur.
*   Notre URL `@tempurl` à retourner dans le JSON.

Comme ceci :

```ruby
def print_a
  @a = A.find(params[:id])
  pdf = render_to_string :pdf => @a.name,
    :template => "prints/printA.pdf.html.erb",
    :layout => nil

  temp_dir = Rails.root.join('public','tmp')
  Dir.mkdir(temp_dir) unless Dir.exists?(temp_dir)
  @tempfile = Tempfile.new [params[:name], '.pdf'], temp_dir
  @tempurl = "#{request.protocol}#{request.host_with_port.sub(/:80$/,"")}/tmp/#{File.basename(@tempfile.path)}"
  File.open(@tempfile.path, 'wb') do |file|
      file << pdf
  end

  render "prints/printA.rabl"
end
```

J'utilise [RABL][8] pour générer mes JSON donc la création est simple :

```ruby
node(:tempurl){ @tempurl }
```

Et voilà ! Je maîtrise l'information de la demande à l'affichage du PDF. Le seul hic est que je fait deux hits au lieu d'un. De quoi ? mes fichiers temporaires dans le dossier public doivent être purgé par un cron ? C'est pour ça que j'aime RoR et encore plus le libre; c'est bien pensé. En effet notre class `Tempfile` génère un fichier qui serra détruit lors du réveil de mes Dynos :p

 [1]: https://github.com/pdfkit/pdfkit
 [2]: https://github.com/mileszs/wicked_pdf
 [3]: https://github.com/antialize/wkhtmltopdf
 [4]: https://github.com/camdez/wkhtmltopdf-heroku
 [5]: https://devcenter.heroku.com/articles/buildpacks#default-buildpacks
 [6]: http://www.alain-andre.fr/?p=1091
 [7]: https://devcenter.heroku.com/articles/background-jobs-queueing
 [8]: http://www.alain-andre.fr/?p=48
