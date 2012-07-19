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
    console.log('oldX: ' + oldX + ', newX: ' + newX);
    console.log('currentW - deltaX: ' + (currentW - deltaX) + ', currentW + deltaX: ' + (currentW + deltaX));

    // Resize adjacent region.
    var adjacent = (splitFrom == 'left') ? this.prev('.region') : this.next('.region');
    var adjacentW = adjacent.outerWidth();
    adjacent.css( {
      'width': adjacentW + deltaX
    } );
    console.log('adjacentW: ' + adjacentW + ', deltaX: ' + deltaX + ', adjacent width: ' + adjacent.css('width'));
  }

  function finishRegionResize(e) {
    resizeRegion.apply(this, arguments);
    $('.splitter').removeClass('splitter-active');
    $(document).unbind('.regionResize');
    // this.find('.splitter').unbind('mouseup.regionResize');
  }

  function createRegion(event, $context) {
    // Create a region to the left or right of the region in question.
    var newRegion = $('<div>', {
      'class': 'region new empty',
      'html': $('<div>', {
        'class': 'splitter splitter-left' 
      })})
      .append($('<p>', {
        'text': $($context).closest('.row').next('.row').find('.region').text()
      }))
      .append($('<div>', {
        'class': 'splitter splitter-right'
      }));
    if (event.side == 'left' && event.siblings !== 'left') {
      newRegion.prependTo($context.closest('.row'));
    }
    else if (event.side == 'right' && event.siblings !== 'right') {
      newRegion.appendTo($context.closest('.row'));
    }
    // $($context).find('.splitter').unbind('mousedown.regionCreate');
  }

  function depositRegion(event, $context) {
    createRegion.apply(this, arguments);
    var $deposit = this.find('.new');
    var $nextRow = this.next('.row');
    $deposit.removeClass('new');
    var $withdrawal = $nextRow.find('.region').detach();
    $(document).unbind('.regionDeposit');
  }

  function withdrawRegion(event, $context) {
    depositRegion.apply(this, arguments);
  }

  $('.splitter').mousedown(function(event) {
    event.stopPropagation();
    var $region = $(this).closest('.region');
    var $row = $(this).closest('.row');
    var fn = $.proxy(createRegion, $region);

    // Determine if there are siblings before or after region.
    var splitterSiblings;
    // @TODO: Fix the following logic; should 'both' be accounted for?
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
    $(document).bind('mousedown.regionCreate', data, fn);
    fn = $.proxy(resizeRegion, $region);
    $(document).bind('mousemove.regionResize', data, fn);
    fn = $.proxy(finishRegionResize, $region);
    $(document).bind('mouseup.regionResize', data, fn);
    fn = $.proxy(depositRegion, $row);
    $(document).bind('mouseup.regionDeposit', data, fn);
    $(this).addClass('splitter-active');
  });

});
