---
title: 'Ubuntu : impossible de finir la sauvegarde'
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2014-02-18 17:06:36 +0200
categories:
  - Petits tutos
tags:
  - sauvegarde ubuntu
---
Il m'était impossible de sauvegarder mes fichiers à l'aide de l'outil de sauvegarde à disposition sous Ubuntu-one. J'obtenais toujours le message suivant.

```bash
Traceback (most recent call last):
  File "/usr/bin/duplicity", line 1414, in <module>
    with_tempdir(main)
  File "/usr/bin/duplicity", line 1407, in with_tempdir
    fn()
  File "/usr/bin/duplicity", line 1289, in main
    globals.archive_dir).set_values()
  File "/usr/lib/python2.7/dist-packages/duplicity/collections.py", line 693, in set_values
    self.get_backup_chains(partials + backend_filename_list)
  File "/usr/lib/python2.7/dist-packages/duplicity/collections.py", line 816, in get_backup_chains
    map(add_to_sets, filename_list)
  File "/usr/lib/python2.7/dist-packages/duplicity/collections.py", line 810, in add_to_sets
    log.Debug(_("File %s is not part of a known set; creating new set") % (filename,))
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe2 in position 23: ordinal not in range(128)
```

En fait il s'agit d'un bug dans la version française que l'on peut éviter en lançant la commande

```bash
$ LANGUAGE=en deja-dup-preferences&
```
