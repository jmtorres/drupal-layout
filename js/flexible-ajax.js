$(function() {
  /**
   * Provide an AJAX response command to allow the server to request
   * height fixing.
   */
  Drupal.ajax.prototype.commands.flexible_fix_height = function(ajax, command, status) {
    Drupal.flexible.fixHeight();
  };

  /**
   * Provide an AJAX response command to allow the server to change width on existing splitters.
   */
  Drupal.ajax.prototype.commands.flexible_set_width = function(ajax, command, status) {
    $(command.selector).html(command.width);
  };

  /**
   * Provide an AJAX response command to fix the first/last bits of a
   * group.
   */
  Drupal.ajax.prototype.commands.flexible_fix_firstlast = function(ajax, data, status) {
    $(data.selector + ' > div > .' + data.base)
      .removeClass(data.base + '-first')
      .removeClass(data.base + '-last');

    $(data.selector + ' > div > .' + data.base + ':first')
      .addClass(data.base + '-first');
    $(data.selector + ' > div > .' + data.base + ':last')
      .addClass(data.base + '-last');
  };

  // Create a generic ajax callback for use with the splitters which
  // background AJAX to store their data.
  var element_settings = {
    url: Drupal.settings.flexible.resize,
    event: 'UpdateFlexibleSplitter',
    keypress: false,
    // No throbber at all.
    progress: { 'type': 'none' }
  };

  Drupal.ajax['flexible-splitter-ajax'] = new Drupal.ajax('flexible-splitter-ajax', $('.panel-flexible-admin').get(0), element_settings);

  // Prevent ajax goo from doing odd things to our layout.
  Drupal.ajax['flexible-splitter-ajax'].beforeSend = function() { };
  Drupal.ajax['flexible-splitter-ajax'].beforeSerialize = function() { };

});

})(jQuery);

