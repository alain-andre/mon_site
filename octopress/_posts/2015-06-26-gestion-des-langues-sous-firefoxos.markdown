---
layout: post
title: "Gestion Des Langues Sous FirefoxOS"
date: 2015-06-26T12:44:28+02:00
comments: true
categories: 
 - Firefox OS
tags :
 - gestion des langues
 - firefoxos
 - localization
 - internationalisation
---

Les applications web doivent de nos jours permettre d’être totalement exploitées par les utilisateurs de nationalités différentes. Pour cela, elle doit prendre en charge diverses langues et afficher son texte dans la langue de l’utilisateur. FirefoxOS nous propose une façon très simple à mettre en place. 

# Le manifeste

Il faut pour gérer les langues ajouter dans le fichier manifeste de l’application le champ **locales** (champ facultatif) tel que ci-dessous. L’interface utilisera ces informations pour traduire les écrans en fonction des paramètres de l’appareil (l’option langue du système).

```javascript
"locales": {
  "es": {
    "description": "¡Acción abierta emocionante del desarrollo del Web!",
    "developer": {
      "url": "http://es.mozillalabs.com/"
    }
  },
  "it": {
    "description": "Azione aperta emozionante di sviluppo di fotoricettore!",
    "developer": {
      "url": "http://it.mozillalabs.com/"
    }
  }  
},
```

Quand le champ **locales** est présent, **default_locale** devient obligatoire.

```javascript
  "default_locale": "en"
```

# Les données

Une fois le manifeste définit, il reste à ajouter les données qui seront chargées par l’application. Ces données doivent se trouver dans un dossier **data** situé à la racine de l’application et contenir les fichier *properties* de chaque langue ainsi que le fichier *locales.ini*.

```bash
data/
  - en.properties
  - es.properties
  - it.properties
  - locales.ini
index.html
```

## Le fichier locales.ini

Il est le fichier qui définit pour chaque langue le nom du fichier *properties* à charger par l’application.

```javascript
@import url(en.properties)

[es]
@import url(es.properties)

[it]
@import url(it.properties)
```

## Le fichier properties

Il contient les paires clés/valeur qui seront utilisées par l’application dans les fichiers HTML. Si l’on veut que la valeur retournée contienne des balises et qu’elles soient interprétées nous pouvons ajouter **.innerHTML** à la clé.  C’est très pratique !

```
app_title = Aplicación privilegiada
app_description.innerHTML = Esta aplicación demuestra cómo usar <code>XMLHttpRequest</code> y el permiso <code>systemXHR</code>.
search = Buscar
searching = Buscando...
search_no_results = No se encontraron resultados
```

## Le fichier HTML

Il doit pré-charger (cf. [html5-prefetch](http://davidwalsh.name/html5-prefetch)) le fichier *locales.ini* ainsi que le JavaScript [l10n.js]( https://github.com/mozilla-b2g/gaia/blob/master/shared/js/l10n.js) fournit par [Gaia]( https://github.com/mozilla-b2g/gaia).

Il est alors possible de faire appel aux **clés** disponibles dans le fichier *properties* à l’aide de l’attribut **data-l10n-id**.

```html
<!-- index.html -->
<html >
  <head>
    <link rel="prefetch" type="application/l10n" href="data/locales.ini" />
     <script type="text/javascript" src="js/libs/l10n.js" defer></script>
  </head>
  <body>
    <h1 data-l10n-id="app_title">Privileged app</h1>
  </body>
</html>
```

# Sources

 * [hacks.mozilla.org ](https://hacks.mozilla.org/2014/01/localizing-the-firefox-os-boilerplate-app/)
 * [developer.mozilla.org](https://developer.mozilla.org/fr/Apps/Manifeste#locales)