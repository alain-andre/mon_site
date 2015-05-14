---
title: Premiers pas sous CodeIgniter
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-11-08 14:06:36 +0200
categories:
  - Codeigniter
  - Petits tutos
tags:
  - codeigniter
  - debuter
  - php-activerecord
---
Au premier abord, je suis très heureux de retrouver une architecture ressemblant à celle de Ruby on Rails. Mais rapidement, la console rails me manque. Globalement, j'ai trouvé l'installation rapide et la documentation assez complète. Le liens à la DB se fait par une sorte d'activeRecord à la CI qui ne me branche pas trop mais bon. J'ai vu nombre de questions sur **stackoverflow** à propos d'ActiveRecord sur CodeIgniter, je décide donc de implanter dans mon projet.

## Installer php-activerecord

L'installation via [sparks][1] est assez simple via **curl** mais ils ont documenté une installation manuelle pour les pauvres développeurs -comme moi- qui sont limités par le pare-feu de leur entreprise.

Donc si vous voulez faire ça en manuel, il faut tout d'abord installer le manager de sparks :

*   créer un dossier *sparks* à la racine de votre projet
*   créer le fichier `application/core/MY_Loader.php` avec le code [suivant][2]
*   vérifier que le paramètre *subclass_prefix* dans `application/config/config.php` est à *MY_* .

Ensuite on va charger le zip de [php-activerecord][1] dont la documentation indépendante de *sparks* se trouve [ici][3].

*   télécharger l'archive
*   créer un dossier `php-activerecord` dans le dossier *sparks* se trouvant à la racine du projet
*   créer le dossier de version `0.0.2` (à l'heure ou j'écris ce post)
*   dézipper l'archive dans un le dossier `sparks/php-activerecord/0.0.2`

On peut maintenant utiliser la class **ActiveRecordModel** dans nos modèles devant utiliser ActiveRecord.

```php
<?php
  class Test extends ActiveRecordModel {
  }
```

Et l'appel à la vue dans un contrôleur :

```php
$this->load->spark('php-activerecord/0.0.2');
echo '<pre>'; var_dump(Test::all()); exit;
```

Voilà. C'est bien mignon tout ça mais moi je voudrais retrouver mes migrations aussi.

## Configurer et lancer les migrations

La [documentation][4] permet de comprendre comment fonctionne les migrations sous codeigniter. Malheureusement il n'y a pas de console disponible permettant de faire une génération, un reset ou autre. Il faut créer un contrôleur **migrate** qui lancera les migrations de la version définie. On va donc commencer par créer une migration pour les *users* dans le fichier suivant :

```php application/migrations/001_add_users.php
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Migration_Add_users extends CI_Migration {

  public function up() {
    $this->dbforge->add_field(array(
      'user_id' => array(
        'type' => 'INT',
        'constraint' => 5,
        'unsigned' => TRUE,
        'auto_increment' => TRUE
      ),
      'user_name' => array(
        'type' => 'VARCHAR',
        'constraint' => '100'
      ),
      'user_password' => array(
        'type' => 'VARCHAR',
        'constraint' => '255'
      )
    ));
    $this->dbforge->add_key('user_id', TRUE);
    $this->dbforge->create_table('users');
  }

  public function down() {
    $this->dbforge->drop_table('users');
  }
}
```

Une fois fait, nous allons modifier le paramètre **$config['migration_version']** du fichier `application/config/migration.php` en le passant à 1 (notre migration **001\_add\_users.php** signifie que l'on est bien à la version **1**).

Tout est configuré, nous pouvons maintenant créer `application/controllers/migrate.php` qui sera appelé pour faire nos migrations. Nous allons protéger l'accès à ce script par une session qui forcera la connexion en tant qu'administrateur.

```php
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Migrate extends CI_Controller {

  function __construct() {
    session_start();
    parent::__construct();
    if ( !isset($_SESSION['username']) ) {
      header('Location: admin');
    }
  }

  public function index() {
    $this->load->spark('php-activerecord/0.0.2');
    $this->load->library('migration');
    if ( ! $this->migration->current())
      show_error($this->migration->error_string());
  }

}
```

 [1]: http://getsparks.org/packages/php-activerecord/versions/HEAD/show
 [2]: http://getsparks.org/static/install/MY_Loader.php.txt
 [3]: http://phpactiverecord.com/projects/main/wiki
 [4]: http://ellislab.com/codeigniter/user-guide/libraries/migration.html
