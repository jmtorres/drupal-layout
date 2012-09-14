<?php

/**
 * @file
 * Definition of Drupal\layout\LayoutFormController.
 */

namespace Drupal\layout;

use Drupal\entity\EntityInterface;
use Drupal\entity\EntityFormController;
use Drupal\region\Region;

/**
 * Form controller for the layout edit/add forms.
 */
class LayoutFormController extends EntityFormController {

  /**
   * Overrides Drupal\entity\EntityFormController::prepareEntity().
   *
   * Prepares the layout object filling in a few default values.
   */
  protected function prepareEntity(EntityInterface $layout) {
    if (empty($layout->regions)) {
      // Set some defaults for the user if this is a new layout.
      $layout->regions = array();
      $default_regions = region_load_all();
      foreach ($default_regions as $region) {
        $layout->regions[$region->id()] = $region->label();
      }
      $layout->overrides = array();
    }
  }

  /**
   * Overrides Drupal\entity\EntityFormController::form().
   */
  public function form(array $form, array &$form_state, EntityInterface $layout) {
    $form['label'] = array(
      '#type' => 'textfield',
      '#title' => t('Label'),
      '#maxlength' => 255,
      '#default_value' => $layout->label(),
      '#description' => t("Example: 'Front page', 'Section page'."),
      '#required' => TRUE,
    );
    $form['id'] = array(
      '#type' => 'machine_name',
      '#default_value' => $layout->id(),
      '#machine_name' => array(
        'exists' => 'layout_load',
        'source' => array('label'),
      ),
      '#disabled' => (bool) $layout->id(),
    );

    $layoutdata = array();
    $default_regions = region_load_all();
    foreach ($layout->regions as $id => $label) {
      $layoutdata['regions'][] = array(
        'name' => $id,
        'admin_title' => $default_regions[$id]->label(),
      );
    }
    $layoutdata['overrides'] = $layout->overrides;

    $form['layout_regions'] = array(
      '#type' => 'textarea',
      '#title' => t('Region and bunnypoint configuration'),
      '#default_value' => drupal_json_encode($layoutdata),
      '#suffix' => '<div id="responsive-layout-designer"></div>',
    );

    $form['#attached'] = array(
      'library' => array(
        array('system', 'ui.dialog'),
        array('system', 'ui.sortable'),
        array('layout', 'layout-rld'),
        array('layout', 'layout-admin'),
      ),
      'js' => array(
        array(
          'data' => array(
            'responsiveLayout' => array(
              'layout' => $layout,
              'defaultRegions' => region_load_all(),
              'defaultBreakpoints' => bunnypoint_load_all(),
              'defaultGrids' => gridbuilder_load_all(),
            ),
          ),
          'type' => 'setting',
        ),
      ),
      'css' => array(
        array(
          // Embed the grid css inline for now. Yeah, I know this is evil.
          // It is just a prototype for now, ok? I know it is evil. Yes.
          'data' => layout_bunnypoint_get_css(FALSE),
          'type' => 'inline',
        ),
      ),
    );

  // JSON2 is required for stringifying JavaScript data structures in older browsers.
  /*$name = 'json2';
  if (!libraries_detect($name)) {
    watchdog('responsive', 'The JSON-js library is recommended for this module to function properly. Some older browsers do not provide the JSON function natively. Please visit !url to obtain this library.',
      array(
        '!url' => l('JSON-js (Github)', 'https://github.com/douglascrockford/JSON-js',
          array(
            'absolute' => TRUE,
            'external' => TRUE
          )
        )
      ),
      WATCHDOG_NOTICE
    );
  }
  else {
    libraries_load($name);
  }*/

    return parent::form($form, $form_state, $layout);
  }

  /**
   * Overrides Drupal\entity\EntityFormController::actions().
   */
  protected function actions(array $form, array &$form_state) {
    // Only includes a Save action for the entity, no direct Delete button.
    return array(
      'submit' => array(
        '#value' => t('Save'),
        '#validate' => array(
          array($this, 'validate'),
        ),
        '#submit' => array(
          array($this, 'submit'),
          array($this, 'save'),
        ),
      ),
    );
  }

  /**
   * Overrides Drupal\entity\EntityFormController::save().
   */
  public function save(array $form, array &$form_state) {
    $layout = $this->getEntity($form_state);

    $default_regions = region_load_all();
    $new_layout_settings = drupal_json_decode($form_state['values']['layout_regions']);

    if (!empty($new_layout_settings)) {
      $layout->regions = array();
      foreach ($new_layout_settings['regions'] as $region) {
        $layout->regions[$region['name']] = $region['name'];

        /*/ Save region in common regions list in case it is new.
        if (!isset($default_regions[$region['name']])) {
          $region = (object) array(
            'name' => $region['name'],
            'admin_title' => $region['admin_title'],
          );
          region_save($region);
        }*/
      }
      $layout->overrides = $new_layout_settings['overrides'];
    }
    $layout->save();

    watchdog('layout', 'Layout @label saved.', array('@label' => $layout->label()), WATCHDOG_NOTICE);
    drupal_set_message(t('Layout %label saved.', array('%label' => $layout->label())));

    $form_state['redirect'] = 'admin/structure/layouts';
  }

}

