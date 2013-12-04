<?php

/**
 * @file
 * Contains \Drupal\layout\Plugin\Type\LayoutManager.
 */

namespace Drupal\layout\Plugin\Type;

use Drupal\Core\Plugin\DefaultPluginManager;

/**
 * Layout plugin manager.
 */
class LayoutManager extends DefaultPluginManager {

  protected $defaults = array(
    'class' => 'Drupal\layout\Plugin\Layout\StaticLayout',
  );

  /**
   * Constructs a new LayoutManager.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations,
   */
  public function __construct(\Traversable $namespaces) {
    parent::__construct('Plugin/Layout', $namespaces);

    // @todo Add alter and cache for definitions.
    //$this->alterInfo($module_handler, 'layout_info');
    //$this->setCacheBackend($cache_backend, $language_manager, 'layout_plugins');
  }

}
