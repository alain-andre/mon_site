---
layout: post
title: "Fichiers Générés Par Plugins Et Livraison via Travis-ci"
---

Pendant la création de mon dernier site statique avec Jekyll, je me suis heurté à une problématique semble-t-il peu commune et que beaucoup de personnes semblent contourner.

Je voulais pouvoir simplement via Travis-ci publier mes mises à jour sur Heroku grâce à un simple *push* sur mon repo github. Oui je suis une vrais faignasse; mais je ne suis pas informaticien pour rien ! Mon problème est que j'ai un plugin qui me génère un json contenant les réferences de mes articles et permettant ainsi une recherche rapide comme vous l'avez probablement découvert en haut à droite de mon site. Ce plugin est issue de [lunrjs](https://github.com/slashdotdash/jekyll-lunr-js-search). Je n'utilise que la partie ruby car mon site tourne avec AngularJS, donc j'ai modifié l'utilisation de ce json.

## Travis-ci : No such file or directory
Aux premières livraisons via Travis-ci, j'avais un problème avec la disponibilité de mon json généré pendant le **build**. En recherchant sur Internet, je ne trouvais pas de réponse interessante. Après

## Heroku : 404 sur mon json
Je n'arrivais pas à obtenir mon json en production. En local avec la commande `jekyll s`, tout se passe bien, mais une fois en production le json n'étais pas disponible. 