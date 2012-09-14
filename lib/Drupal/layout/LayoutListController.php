<?php

/**
 * @file
 * Definition of Drupal\layout\LayoutListController.
 */

namespace Drupal\layout;

use Drupal\config\EntityListControllerBase;
use Drupal\entity\EntityInterface;

/**
 * Provides a listing of Layouts.
 */
class LayoutListController extends EntityListControllerBase {

  public function __construct($entity_type, $entity_info = FALSE) {
    parent::__construct($entity_type, $entity_info);
  }

  /**
   * Overrides Drupal\config\EntityListControllerBase::hookMenu();
   */
  public function hookMenu() {
    $path = $this->entityInfo['list path'];
    $items = parent::hookMenu();

    // Override the access callback.
    // @todo Probably won't need to specify user access.
    $items[$path]['title'] = 'Layouts';
    $items[$path]['description'] = 'Manage list of layouts.';
    $items[$path]['access callback'] = 'user_access';
    $items[$path]['access arguments'] = array('administer layouts');

    return $items;
  }

  /**
   * Implements Drupal\config\EntityListControllerInterface::defineOperationLinks();
   */
  public function defineOperationLinks(EntityInterface $layout) {
    $path = $this->entityInfo['list path'] . '/layout/' . $layout->id();
    $definition['edit'] = array(
      'title' => t('Edit'),
      'href' => "$path/edit",
    );
    $definition['delete'] = array(
      'title' => t('Delete'),
      'href' => "$path/delete",
    );
    return $definition;
  }

}
