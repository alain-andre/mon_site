---
title: Format de date international en JavaScript et Ruby
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-10-21 20:07:36 +0200
categories:
  - Ruby on Rails
tags:
  - format date
  - international
  - rails
---
Lorsqu'on enregistre des dates dans nos bases de données, le format utilisé pour les stocker n'est pas forcement très accessible à l'utilisateur de notre application. Il nous faut donc faire quelques manipulations afin d’offrir à l'utilisateur une expérience plus agréable. Pour cela nous allons utiliser la fantastique gem [I18n][1] que j'aime par dessus tout tant pour sa simplicité de mise en place et d'utilisation que pour sa puissance (surtout la [pluralisation][2]).

Pour commencer on va ajouter dans nos fichiers de langue (`fr.yml` par exemple) les lignes suivantes qui vont nous permettre d'obtenir le bon format selon la langue demandée.

```ruby
time:
  formats:
    default: "%d/%m/%Y %H:%M:%S"
date:
  formats:
    default: "%d/%m/%Y"
```

Pour l'affichage de nos données via Ruby, nous pouvons maintenant utiliser le helper `I18n.l` :

```ruby
> I18n.l Time.now
=>18/10/2013 12:32:12
# ou via avec ActiveRecord
> I18nl User.last.last_sign_in_at
=> 10/02/2013 08:01:20
```

Nous allons donc l'utiliser afin de créer une variable &#95;DATE&#95;FORMAT pour notre JavaScript. Dans la partie header du fichier application.html.erb :

```ruby
<%= javascript_tag "var _DATE_FORMAT = '#{I18n.t('date.formats.default')}';" %>
```

De cette façon il est possible de créer une fonction getToday nous retournant la date au format voulu :

```javascript
function getToday(){
  return new Date().format(_DATE_FORMAT);
}
// Il est donc aussi simple de passer le format à notre plug-in datepicker (ici avec mootools)
new Picker.Date(this.el.getElement('.date'), {
  positionOffset: { x: 5, y: 0 }
  ,pickerClass: 'datepicker_bootstrap'
  ,useFadeInOut: !Browser.ie
  ,format: _DATE_FORMAT
});
```

 [1]: https://github.com/svenfuchs/i18n
 [2]: https://github.com/svenfuchs/i18n/wiki/Pluralizations
