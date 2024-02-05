<?php
/**
 * Plugin Name: ToDo Block
 * Description: ToDo block to integrate todo app with Wordpress.
 * Version: 1.0
 * Author: Jezdimir Loncar
 */

if (!defined('ABSPATH')) {
    exit;
}

function enqueue_block_assets() {
    wp_enqueue_script(
      'todo-block-fe',
      plugins_url('dist/frontend.js', __FILE__),
      array('wp-element'),
      filemtime(plugin_dir_path(__FILE__) . 'dist/frontend.js'),
      true
    );
  }
  
function enqueue_block_editor_assets() {
    wp_enqueue_script(
        'todo-block',
        plugin_dir_url(__FILE__) . 'dist/editor.js',
        array('wp-blocks', 'wp-editor'),
        filemtime(plugin_dir_path(__FILE__) . 'dist/editor.js')
    );
}

add_action('enqueue_block_editor_assets', 'enqueue_block_editor_assets');
add_action('enqueue_block_assets', 'enqueue_block_assets');
