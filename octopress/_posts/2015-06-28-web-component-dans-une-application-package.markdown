---
layout: post
title: "Web Component Dans Une Application Packagée"
date: 2015-06-28T18:50:02+02:00
comments: true
categories: 
 - Firefox OS
tags :
 - polymer
 - web-app
 - packaged app
 - csp
 - inline-script
---

Pendant mon [étude](https://www.polymer-project.org/1.0/docs/start/reusableelements.html#introduction) sur la création de composants personnalisés avec [Polymer](https://www.polymer-project.org/1.0/), je me suis aperçu qu'il fallait pour que tout fonctionne correctement que les composants soient servis depuis un serveur (polyserve dans cet exemple) or moi je veux qu'ils soient [packagés](https://developer.mozilla.org/en-US/Marketplace/Options/Packaged_apps).

#  Content Security Policy error

Une fois que je veux tester mon composant dans une **application web packagée**, rien ne fonctionne comme prévu. Le message suivant apparaît dans la console.

```
Content Security Policy: The page's settings blocked the loading of a resource at data:text/javascript
```

Mon fichier *index.html* appelle **webcomponents-lite.js** et importe **seed-element.html** qui lui-même importe **polymer.html** et définit mon composant à l'aide de la balise **dom-module**. Mais l’élément **seed-element** n'affiche pas les informations *name* et *image* qu'il devrait.

```html
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
    <title>seed-element Demo</title>
    <script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="seed-element.html">
  </head>
  <body>

    <p>An example of <code>&lt;seed-element&gt;</code>:</p>

    <button>Say Something</button>

    <seed-element author='{"name": "Lord Meowser", "image": "http://placekitten.com/g/200/300"}' fancy>
      <h2>Hello seed-element</h2>
    </seed-element>


  </body>
</html>
```

Après avoir [cherché](https://developer.mozilla.org/fr/Apps/PSC) un peu [partout](https://developer.mozilla.org/fr/Apps/Manifeste#csp), j'ai compris que les applications packagées avaient un fonctionnement particulier dû à leurs accès privilégiés aux [API](https://developer.mozilla.org/fr/Apps/Reference/APIs_Web_Generales)s du navigateur. Et que notamment  les **script inline** sont **interdits**.

Ces applications ont des restrictions qui sont définies dans le **manifeste**. 

# Le manifeste

Le **manifest** permet de modifier le [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives)(*CSP*) qui est un champ facultatif précisant une politique de sécurité.

Pour les applications **certifiées** et **privilégiées**, une **CSP** par défaut s'applique toujours, même si on n'utilise pas ce champ. Si l'on modifie une des propriétés, elle serra fusionnée avec celles déjà présentes.

*CSP* d'une application privilégiée.

```
default-src *; script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'
```

*CSP* d'une application certifiées.

```
default-src *; script-src 'self'; object-src 'none'; style-src 'self'
```

Je me dis alors qu'il suffit de modifier ces informations pour que mon problème soit résolu, mais il n'en est rien est heureusement ! En fait, il est possible de **réduire les droits** mais **en aucun cas** de les **accroître**. L'idée est que les applications web ont accès à des **fonctionnalités natives** mais ont les **droits d'une page web**. Chaque web-app fonctionne donc comme des **bacs à sable** (*sandbox*) et offrent une **sécurité de haut niveau**.

# Polymer et les scripts inline

Ne pouvant rien changer du côté du *manifeste*, je cherche chez Polymer s'il y a une façon d'éviter le script *inline*. Je tombe sur un [article](https://www.polymer-project.org/0.5/articles/concatenating-web-components.html#content-security-policy) de 2013 qui permet d'utiliser Polymer dans un environnement CSP. On y apprend qu'il est possible de réduire le code entier du projet en un seul fichier à l'aide de [vulcanize](https://github.com/Polymer/vulcanize) et qu'avec l'option **--csp** il extrait tous les scripts dans un fichier JavaScript qui serra utilisé par index.html.

Cet article était un peu vieux et l'option **--csp** ne fonctionne plus de la sorte. Aujourd'hui cette option a son propre [projet](https://github.com/PolymerLabs/crisper). Une fois votre application prête, il faut la *vulcaniser* avec l'option **--inline-script** afin d'intégrer dans votre code tous les scripts externes, puis passer le code généré à **crisper** pour obtenir un fichier *.html* et le *.js* qui contient tous les scripts.

```bash
vulcanize index.html --inline-script | crisper --html build.html --js
build.js
```

Avec ces nouveaux fichiers générés, les *web components* fonctionnent correctement dans une application packagée.