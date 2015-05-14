---
title: Mise en place d'une authentification sous CodeIgniter
author: Alain ANDRE
layout: post
comments: true
published: true
date: 2013-11-24 20:06:36 +0200
categories:
  - Codeigniter
  - Petits tutos
tags:
  - authentifier
  - codeigniter
---
Permettre l'authentification sur un site complexe est une obligation. CodeIgniter nous permet de gérer les sessions de façon plus complète que le $_SESSION de PHP.

Pour commencer il faut modifier le paramètre **$config['encryption_key']** du fichier `application/config/config.php`.

Ceci nous permet de charger la session dans notre contrôleur avec la commande `$this->load->library('session');` et d'y accéder par `$this->session`

# Création des fichiers nécessaires

## application/views/login_view

```php 
<?php echo form_open('admin', 'class="form"'); ?>
// login_view
<p>
  <?php echo form_label('Identifiant: ', 'login'); ?>
  <?php echo form_input('user_name', set_value('user_name'), 'class="form-control" id="login" autofocus'); ?>
</p>
<p>
  <?php echo form_label('Mot de passe:', 'password'); ?>
  <?php echo form_password('user_password', '', 'class="form-control" id="password"'); ?>
</p>
<p class="pull-right">
  <?php echo form_submit('send', 'Envoyer', 'class="btn btn-default"'); ?>
</p>
<p>
  <?php echo form_close(); ?>
  <?php echo validation_errors(); ?>
</p>
```

## application/controllers/admin

```php 
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
// admin

class Admin extends CI_Controller {

  public function __construct() {
    parent::__construct();
  }

  public function index() {
    if($this->session->userdata('username')) redirect('welcome');

    $this->load->library('form_validation');
    $this->form_validation->set_rules('user_name', 'Identifiant', 'required');
    $this->form_validation->set_rules('user_password', 'Mot de passe', 'required|min_length[4]');

    if ( $this->form_validation->run() !== false ) {
        // then validation passed. Get from db
        $this->load->model('user');
        $res = $this
                 ->user
                 ->verify_user(
                    $this->input->post('user_name'),
                    $this->input->post('user_password')
                 );

        if ( $res !== false ) { // @todo controle isadmin
          $this->session->set_userdata('isadmin', true);
          $this->session->set_userdata('username', 'admin');
          redirect('welcome');
        }
    }

    $this->load->spark('php-activerecord/0.0.2');
    $this->load->view('_header');
    $this->load->view('login_view');
    $this->load->view('_footer');
  }

  public function logout() {
    $this->session->sess_destroy();
    redirect('admin');
  }
}
```

## application/controllers/welcome

```php 
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
// welcome
class Welcome extends CI_Controller {

  function __construct() {
    parent::__construct();
    if(!$this->session->userdata('username')) redirect('admin');
  }

  /**
  * Index Page for this controller.
  *
  * Maps to the following URL
  *   http://example.com/index.php/welcome
  * - or -
  *   http://example.com/index.php/welcome/index
  * - or -
  * Since this controller is set as the default controller in
  * config/routes.php, it's displayed at http://example.com/
  *
  * So any other public methods not prefixed with an underscore will
  * map to /index.php/welcome/<method_name>
  * @see http://codeigniter.com/user_guide/general/urls.html
  */
  public function index() {
    $this->load->spark('php-activerecord/0.0.2');
    $this->load->view('_header');

    if($this->session->userdata('isadmin')) $this->load->view('admin_view');
    else $this->load->view('portail_view');

    $this->load->view('_footer');
  }
}
```

## La classe User sans php-activerecord

Nous allons maintenant passer au modèle User appelé dans `application/controllers/admin`. Il fait appel à la fonction `verify_user` de la classe `User`

```php 
<?php
// admin
class User extends CI_Model {
  function __construct() { }

  public function verify_user($user_name, $password) {
      $q = $this
            ->db
            ->where('user_name', $user_name)
            ->where('user_password', sha1($password))
            ->limit(1)
            ->get('users');

      if ( $q->num_rows > 0 ) {
         // person has account with us
         return $q->row();
      }
      return false;
  }
}
```

## La classe User avec php-activerecord

Aillant découvert ActiveRecord avec Ruby on Rails, je ne peux me résoudre à travailler sans. Voici la classe avec php-activerecord

```php
<?php
// admin
  /**
   * Class de gestion des utilisateurs via activerecord
   */
  class User extends ActiveRecordModel {

    public function verify_user($user_name, $password) {
      $user = User::first(array('conditions' => array('user_name = ? and user_password = ?', $user_name, sha1($password)) ));
      if($user){
        if($user->user_isadmin === 1) return 'isadmin';
        else return 'logged';
      }
      return false;
    }
  }
```

**NB:** Pour que ça fonctionne bien il ne faut pas oublier de charger dans la config **autoload** les paramètres suivant `$autoload['helper'] = array('form', 'url');`. Ça fonctionne aussi si on appelle les helpers à chaque fois, mais je trouve que ce sont des helpers utilisés sur chaque page de mon site, alors je les autoload.
