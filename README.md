# Mon site web
Mon site statique personnel généré avec [jekyll](http://jekyllrb.com/) et déployé automatiquement sur [Heroku](https://www.heroku.com/) via [travis-ci](https://travis-ci.org/).

[![Build Status](https://travis-ci.org/alain-andre/mon_site.svg)](https://travis-ci.org/alain-andre/mon_site)

## Commandes [octopress](https://github.com/octopress/octopress)

- new post <TITLE>    # Add a new post to your site
- new page <PATH>     # Add a new page to your site
- new draft <TITLE>   # Add a new draft post to your site
- publish <POST>      # Publish a draft from _drafts to _posts
- unpublish <POST>    # Search for a post and convert it into a draft
- isolate [POST]      # Stash all posts but the one you're working on for a faster build
- integrate           # Restores all posts, doing the opposite of the isolate command

## Commandes [jekyll](https://github.com/jekyll/jekyll)

- jekyll s --source octopress