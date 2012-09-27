<?php

/**
 * @file
 * Definition of Drupal\layout\Layout.
 */

namespace Drupal\layout;

use Drupal\Core\Config\Entity\ConfigEntityBase;

/**
 * Defines the layout entity.
 */
class Layout extends ConfigEntityBase {

  /**
   * The layout ID (machine name).
   *
   * @var string
   */
  public $id;

  /**
   * The layout UUID.
   *
   * @var string
   */
  public $uuid;

  /**
   * The layout label.
   *
   * @var string
   */
  public $label;

  /**
   * List of regions used in this layout.
   *
   * @var array
   */
  public $regions;

  /**
   * Region width overrides for different breakpoints.
   *
   * @var array
   */
  public $overrides;

}
