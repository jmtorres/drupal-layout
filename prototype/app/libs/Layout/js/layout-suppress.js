$(function() {

  function resizeRegion(e) {
    var siblingTo = e.data.siblings;
    var splitFrom = e.data.side;
    var initialX = e.data.origin.left;
    var newX = e.pageX;
    var oldW = e.data.width;
    var newW = this.outerWidth();
    var oldX = (splitFrom == 'left') ? this.position().left : this.position().left + newW;
    var deltaX = (splitFrom == 'left') ? newX - oldX : oldX - newX;
    var gutter = (siblingTo == 'left') ? 'margin-left' : 'margin-right';

    // Resize current region.
    var currentW = this.width();
    this.css( {
      gutter: '5px',
      'width': currentW - deltaX
    } );
    // console.log('oldX: ' + oldX + ', newX: ' + newX);
    // console.log('currentW - deltaX: ' + (currentW - deltaX) + ', currentW + deltaX: ' + (currentW + deltaX));

    // Resize adjacent region.
    var adjacent = (splitFrom == 'left') ? this.prev('.region') : this.next('.region');
    var adjacentW = adjacent.outerWidth();
    adjacent.css( {
      'width': adjacentW + deltaX
    } );
    // console.log('adjacentW: ' + adjacentW + ', deltaX: ' + deltaX + ', adjacent width: ' + adjacent.css('width'));
  }

  function finishRegionResize(event) {
    resizeRegion.apply(this, arguments);
    $('.splitter').removeClass('splitter-active');

    // Withdraw current region if its width is too low.
    if (this.width() < 100) {

      // @TODO: Hide things that break the layout as the width gets too low.
      this.find('p').hide();
      this.find('.splitter-right').hide();

      // Prepend $withdrawal to the next row.
      // console.log(this);
      // console.log(this.closest('.row').next('.row'));
      if ($withdrawal) {
        $withdrawal.prependTo(this.closest('.row').next('.row'));
      }
      else {
        $withdrawal = this.closest('.row').next('.row').find('.region');
      }
      // console.log(this.closest('.row').next('.row'));
      this.css('width', 960);
      this.closest('.row').prev('.row').find('.region').css('width', 960);
      var $deposit = this.detach();
    }

    // @TODO: Withdraw adjacent region if its width is too low.
    var adjacent = (event.side == 'left') ? this.prev('.region') : this.next('.region');
    var adjacentW = adjacent.outerWidth();
    if (adjacentW < 100 && adjacent) {
      console.log(adjacent);
      adjacent.prependTo(this.closest('.row').next('.row'));
      adjacent.css('width', 960);
      this.closest('.row').prev('.row').find('.region').css('width', 960);
    }
    
    $(document).unbind('.regionResize');
    // this.find('.splitter').unbind('mouseup.regionResize');
  }

  function createRegion(event, $context) {
    // Create a region to the left or right of the region in question.
    var nextRegionName = $($context).closest('.row').next('.row').find('.region').text();
    var newRegion = $('<div>', {
      'class': 'region new empty',
      'html': $('<div>', {
        'class': 'splitter splitter-left' 
      })})
      .append($('<p>', {
        'text': (nextRegionName) ? nextRegionName : $($context).closest('.row').next('.row').next('.row').find('.region').text()
      }))
      .append($('<div>', {
        'class': 'splitter splitter-right'
      }));

    // Find any newly created regions. If there are none, suppress creation.
    if (this.find('.empty').length > 0) {
      if (event.side == 'left' && event.siblings !== 'left') {
        newRegion.prependTo($context.closest('.row'));
      }
      else if (event.side == 'right' && event.siblings !== 'right') {
        newRegion.appendTo($context.closest('.row'));
      }
      this.find('.region').removeClass('empty');
    }
    $($context).find('.splitter').unbind('mousedown.regionCreate');
  }

  function depositRegion(event, $context) {
    // this = .row
    createRegion.apply(this, arguments);
    var $nextRow = ($.trim(this.next('.row').html()).length) ? this.next('.row') : this.next('.row').next('.row');

    var $deposit = this.find('.new');
    $deposit.removeClass('new');

    // Find any newly created regions. If there are none, suppress deposit.
    if (this.find('.empty').length > 0) {
      $withdrawal = $nextRow.find('.region').detach();
      this.find('.region').removeClass('empty');
    }
    
    // $(document).unbind('.regionDeposit');
  }

  $('.splitter').live('mousedown', function(event) {
    event.stopPropagation();
    var $region = $(this).closest('.region');
    var $row = $(this).closest('.row');
    var fn = $.proxy(createRegion, $region);

    // Determine if there are siblings before or after region.
    var splitterSiblings;
    if ($region.prev().length === 1) {
      splitterSiblings = 'left';
    }
    else if ($region.next().length === 1) {
      splitterSiblings = 'right';
    }
    if ($region.prev().length === 1 && $region.next().length === 1) {
      splitterSiblings = 'both';
    }

    // Determine if the splitter is on the left or right side of region.
    var splitterSide = ($(this).hasClass('splitter-left')) ? 'left' : 'right';

    var data = {
      origin: {
        top: $region.position().top,
        left: $region.position().left
      },
      width: $region.outerWidth(),
      siblings: splitterSiblings,
      side: splitterSide
    };
    createRegion(data, $region);
    // $(document).bind('mousedown.regionCreate', data, fn);
    fn = $.proxy(resizeRegion, $region);
    $(document).bind('mousemove.regionResize', data, fn);
    fn = $.proxy(finishRegionResize, $region);
    $(document).bind('mouseup.regionResize', data, fn);
    if ($(this).hasClass('splitter-edge')) {
      fn = $.proxy(depositRegion, $row);
      $(document).bind('mouseup.regionDeposit', data, fn);
    }
    $(this).addClass('splitter-active');
  });

});
