(function (RLD, $) {

  RLD['Region'] = (function () {

    var plugin = 'Region';
    
    // Region manipulation functions.
    function startResize(event) {
      event.stopImmediatePropagation();
      // Disable sortable while resize is active.
      var region = this;
      var $region = this.info('$editor');
      var $delegator = $(event.getDelegator());
      var $splitter = $(event.target);
      var $row = $region.closest('.row');
      $delegator.sortable('disable');
      // Since the resize function will be called on mousemove, we don't want
      // to calculate the state of the row's region more than once. So we
      // pass this information into the handlers.
      var data = {};
      data.$object = $region;
      data.object = region;
      // Determine if the splitter is on the left or right side of region.
      data.side = $splitter.data('RLD/Region/Splitter-side');
      data.width = $region.outerWidth();
      data.siblings = {
        '$left': $region.prevAll('.region'),
        '$right': $region.nextAll('.region')
      };
      // Calculate the X origin. This is either the left or right edge of the active
      // region, depending on which splitter is clicked.
      data.regionX = 0;
      data.siblings.$left.each(function () {
        var $this = $(this);
        data.regionX += $this.outerWidth();
      });
      data.regionX += (data.side === 'right') ? data.width : 0;
      data.mouseX = event.pageX;
      data.bounds = {};
      data.bounds.width = $row.width();
      data.bounds.left = $row.position().left;
      data.bounds.right = $row.position().left + data.bounds.width;
      data.$delegator = $delegator;
      // Mark the splitter active.
      $splitter.addClass('splitter-active');
      // Add behaviors.
      fn = $.proxy(dragging, region);
      $(document).bind('mousemove.regionResize', data, fn);
      fn = $.proxy(finishResize, region);
      $(document).bind('mouseup.regionResize', data, fn);
      // Call listeners.
      region.triggerEvent('regionResizeStarted', data);
    }

    function dragging(event) {
      event.stopImmediatePropagation();
      if (event.pageX <= event.data.bounds.left || event.pageX >= event.data.bounds.right) {
        return false;
      }
      var region = this;
      var $region = this.info('$editor');
      var side = event.data.side;
      var deltaX = event.pageX - event.data.mouseX;
      
      if (event.data.side === 'left') {
        // Resize the region.
        $region.css({
          'width': event.data.width - deltaX
        });
        // Resize the left siblings.
        event.data.siblings.$left.css({
          'width': event.data.regionX + deltaX
        });
      }
      if (event.data.side === 'right') {
        // Resize the region.
        $region.css({
          'width': event.data.width + deltaX
        });
        // Resize the left siblings.
        event.data.siblings.$right.css({
          'width': event.data.bounds.width - (event.data.regionX + deltaX)
        }); 
      }
      region.triggerEvent('regionResizing', event.data);
    }

    function finishResize(event) {
      event.stopImmediatePropagation();
      var region = this;
      var $delegator = $(event.getDelegator());
      $delegator.sortable('enable');
      // Perform a final resize.
      dragging.apply(this, arguments);
      // Clean up the DOM.
      $(this).find('.splitter').removeClass('splitter-active');
      $(document).unbind('.regionResize');
      // 
      region.triggerEvent('regionResized', event.data);
    }

    function close(event) {
      event.stopPropagation();
      var $region = $(this).closest('.region');
      // If region has no siblings, hide row. Otherwise, hide region.
      if ($region.prev().length === 0 && $region.next().length === 0) {
        $region.closest('.row').remove();
      }
      else {
        $region.remove();
      }
    }
    /**
     *
     */
    function Region() {
      this.visibility;
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Region.prototype = new RLD.InitClass();
    /**
     *
     */
    Region.prototype.build = function (options) {
      // @todo this classes stuff needs to be generalized.
      var classes = ['region'];
      var fn;
      if ('classes' in options && 'length' in options.classes && options.classes.length > 0) {
        classes = classes.concat(options.classes).join(' ');
      }
      this.$editor = $('<div>', {
        'id': 'region-' + this.label.split(' ').join('_'),
        'class': classes,
        'html': $('<p>', {
          'text': 'Region ' + this.label
        })
      })
      .prepend(
        $('<div>', {
          'class': 'splitter splitter-left'
        })
        .data('RLD/Region/Splitter-side', 'left')
      )
      .append($('<a>', {
        'class': 'region-close',
        'href': '#',
        'text': 'Close'
      }))
      .append(
        $('<div>', {
          'class': 'splitter splitter-right'
        })
        .data('RLD/Region/Splitter-side', 'right')
      )
      .data('RLD/Region', this);
      // Region behaviors.
      fn = $.proxy(close, this);
      this.$editor
      .delegate('.region-close', 'mousedown.ResponsiveLayoutDesigner', close);
      fn = $.proxy(startResize, this);
      this.$editor
      .delegate('.region .splitter', 'mousedown.ResponsiveLayoutDesigner', fn);
    
      return this.$editor;
    };
  
    return Region;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
