---
layout: post
title: "Web Components"
date: 2015-06-25T18:13:36+02:00
comments: true
categories: 
 - Firefox OS
tags :
 - web components
 - x-tag
 - polyfill
 - polymer
 - brick
---

Dans mon approche de création d’un générateur d’applications webs, je recherche aujourd’hui une approche plus orientée composant que le MVC d’AngularJS, plus simple que les directives tout en gardant la force du *data binding*.

Mon objectif est donc d’intégrer les *web components* dans mon générateur. Je veux que ces composants soient proches de l’interface de FirefoxOS mais que l’application soit utilisable sur tous les navigateurs modernes et installable sur tous les smartphones. 

Les *web components* sont disponibles grâce aux navigateurs modernes qui nous permettent de fournir nos propres paquets de définition de composants qui s’ajoutent alors temporairement à ceux qui sont natifs (c’est un peu comme la révolution du css avec Netscape). Mais tous les navigateurs ne supportent pas forcément cette technologie - c’est notamment le cas de IE qui au jour où j’écris ces lignes [considère]( https://status.modern.ie/templateelement) leur implémentation - Pour cette raison nous utilisons un [polyfill]( https://fr.wikipedia.org/wiki/Polyfill) - plateforme JavaScript qui permet de simuler des fonctionnalités non supportées en natif par le navigateur -

# La création sans polyfill
Le W3C définit les [spécificités]( http://w3c.github.io/webcomponents/spec/custom/) de la création de son propre composant. On y apprend notamment qu’il faut fournir un paquet en utilisant la balise **link** et l’attribut **rel=import** tel que ci-dessous.

```html
<!-- index.html -->
<link rel="import" href="x-foo.html">
```

Ce fichier **import.html** doit contenir le script le balisage HTML et le Style css que l’on souhaite apporter sous la balise **x-foo** pour notre exemple. 

Le JavaScript doit **enregistrer auprès du document** en cours d’interprétation par le navigateur le composant personnalisé comme ceci :

```javascript
// x-foo.html
document.registerElement('x-foo', {
    prototype: Object.create(HTMLParagraphElement.prototype, {
        firstMember: {
            get: function() { return "foo"; },
            enumerable: true,
            configurable: true
        },
        // specify more members for your prototype.
        // ...
    }),
    extends: 'p'
});
```

Il est alors possible d’utiliser ce composant en étendant une balise existante.

```html
<p is="x-foo">Paragraph of amazement</p>
```

Mais il est aussi possible de l’utiliser pour créer une balise à l’aide de JavaScript.

```html
<!-- x-foo.html -->
<script type="text/javascript">
  var foo = document.createElement('p', 'x-foo');
</script>
<x-foo>Mon composant est devenu une balise !</x-foo>
```

# Choisir sa libraire
Les projets de *polyfillisation* sont nombreux mais tout ceci évolue beaucoup depuis trois ans et il est difficile de s’y retrouver sans une petite étude. On trouve beaucoup d’information et de documentations sur les web components tel que [X-tag](http://x-tags.org/), [Brick](http://brick.readme.io/v2.0/), [Polymer](https://www.polymer-project.org/1.0/), [Building Blocks FirefoxOS](http://buildingfirefoxos.com/building-blocks/action-menu.html) mais nombre d’entre eux semblent ne plus évoluer depuis 2013-2014. 

J’ai contacté des développeurs de divers projets (Building Blocks et Brick) afin de leur demander ce qu’il en était. **Building Blocks** n’est plus maintenu. Mozilla développait **X-Tag** qui est basé sur le *polyfill* du projet Polymer mais y ajoutait des supports pour le navigateur IE9. Le développement de X-Tag semble aussi gelé depuis 2014. 

**Brick** utilisait x-tag dans sa version 1 mais pour sa version 2 a décidé pour des raisons de [complexité]( http://brick.readme.io/v2.0/blog/welcome-to-mozilla-brick#section-on-x-tag) de syntaxe de l’abandonner au profit de [platform.js](https://github.com/bestiejs/platform.js) qui aux [dires]( https://www.polymer-project.org/0.5/docs/start/platform.html) de l’organisation Polymer n’est maintenu en 2015 qu’un certain temps pour des raisons de compatibilités mais a migré vers [webcomponents.js]( http://webcomponents.org/). 

Polymer utilise *webcomponents.js* comme plate-forme et offre en plus d'une syntaxe simple pour la création de composants une gestion du *data binding* ainsi que des outils de test et une documentation complète. Je vais donc me lancer dans l'utilisation de Polymer pour mes applications.