(function (RLD, $, _) {
  
  RLD['Layout'] = (function () {

    var plugin = 'Layout';

    // Layout Class
    function Layout() {
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Layout.prototype = new RLD.InitClass();
    
    Layout.prototype.setup = function () {
      var processShift = $.proxy(this.processShift, this);
      var processRemove = $.proxy(this.processRemove, this);
      this.regionList.registerEventListener({
        'regionResizeStarted': processShift,
        'regionResizing': processShift,
        'regionResized': processShift,
        'regionClosed': processRemove
      });
    };
    
    Layout.prototype.build = function (options) {
      this.$editor = $('<div>', {});
      var regions = this.regionList.info('items');
      var i, fn;
      // Build rows and regions.
      if (regions.length > 0) {
        for (i = 0; i < regions.length; i++) {
          $('<div>', {
            'class': 'row clearfix'
          })
          .append(regions[i].build({
            'classes': ['unit']
          }))
          .appendTo(this.$editor);
        }
      }
      // Bind behaviors.
      fn = $.proxy(this.processSort, this);
      this.$editor.sortable({
        // Make a placeholder visible when dragging.
        placeholder: "ui-state-highlight",
        // When the dragging and dropping is done, save updated region
        // list in our local list.
        deactivate: fn
      });
      
      // Return the editor as a DOM fragment.
      return this.$editor;
    };
    
    Layout.prototype.processSort = function(event, ui) {
      var regionList = [];
      var i;
      // Get the region objects in their new order.
      var $regions = ui.sender.find('.region');
      for (i = 0; i < $regions.length; i++) {
        regionList.push($($regions[i]).data('RLD/Region'));
      }
      this.regionList.update(regionList);
    };
    
    Layout.prototype.processShift = function (event, data) {
      switch (event.type) {
      case 'regionResizeStarted':
        var $this = data.$object;
        var $currentRow = $this.closest('.row');
        if (data.siblings['$' + data.side].length === 0) {
          var $placeholder = this.buildPlaceholder();
          $placeholder[(data.side === 'left') ? 'insertBefore' : 'insertAfter']($this);
          data.siblings['$' + data.side] = $placeholder;
        }
        break;
      case 'regionResizing':
        break;
      case 'regionResized':
        var $this = data.$object;
        var $currentRow = $this.closest('.row');
        var placeholders = {
          '$left': $currentRow.find('.placeholder:first'),
          '$right': $currentRow.find('.placeholder:last')
        };
        var $nextRow = $currentRow.next('.row');
        var $candidateRegion = $nextRow.find('.region');
        if ($candidateRegion.length > 0) {
          var $shiftedRegion = $candidateRegion.detach();
          var width = placeholders['$' + data.side].width();
          placeholders['$' + data.side].replaceWith(
            $shiftedRegion
            .css({
              width: width
            })
          );
          this.updateRow($nextRow);
        }
        break;
      default:
        break;
      }
    };
    
    Layout.prototype.updateRow = function ($row) {
      var $regions = $row.find('.region');
      if ($regions.length === 0) {
        $row.slideUp(function () {$(this).remove()});
      }
      if ($regions.length === 1) {}
      if ($regions.length > 1) {}
    };
    
    Layout.prototype.buildPlaceholder = function () {
      return $('<div>', {
        'class': 'placeholder unit'
      });
    };
    
    Layout.prototype.processRemove = function (event) {
      
    };
    
    return Layout;
    
  }());
}(ResponsiveLayoutDesigner, jQuery, _));
