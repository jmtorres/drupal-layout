(function (RLD, $) {
  /**
   * LayoutManager editor provides functionality to display, add and remove
   * layout representations across arbitrary, user-defined breakpoint limits.
   */
  RLD['LayoutManager'] = (function build() {

    var plugin = 'LayoutManager';
    
    function LayoutManager() {
      // Ui components.
      this.options = {
        'ui': {
          'class-layout': 'rld-stepmanager',
          'class-layout-tabs': 'rld-steps',
          'class-layout-content': 'rld-layouts'
        }
      };
      this.$editor = $();
      this.$stepSelector = $();
      this.$steps = $();
      this.$layouts = $();
      this.layouts = [];
      this.regionList = {};
      // Setup
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    LayoutManager.prototype = new RLD.InitClass();
    /**
     * Integrate instantiation options.
     */
    LayoutManager.prototype.setup = function () {
      var fn;
      this.stepManager = new RLD.StepManager();
      // Register
      fn = $.proxy(this.switchStep, this);
      this.stepManager.registerEventListener('stepActivated', fn);
      // Assemble the editor managers and containers.
      this.$stepSelector = $('<div>', {
        'class': this.ui['class-layout']
      });
      this.$steps = $('<ul>', {
        'class': this.ui['class-layout-tabs']
      });
      this.$layouts = $('<div>', {
        'class': this.ui['class-layout-content']
      });
    };
    /**
     *
     */
    LayoutManager.prototype.build = function () {
      // Assemble the editor fraemwork.
      this.$editor = $('<div>', {
        'class': 'rld-layout-manager'
      })
      .append(
        $('<div>', {
          'class': 'rld-controls'
        })
        .append(
          $('<button>', {
            'class': 'save',
            'text': 'Save layouts'
          })
        )
      )
      .append(
        this.$stepSelector
        .append(
          this.stepManager.build(this.$steps)
        )
      )
      .append(
        this.$layouts
        .append(
          $('<div>', {
            'class': 'screen clearfix',
          })
        )
      );
      /*this.$editor
      .delegate('button.save', 'click.ResponsiveLayoutDesigner', {'type': 'save'}, this.update); */
      // The editor is built and ready to be attached.
      this.switchStep();
      return this.$editor;
    };
    /**
     * A layout is a set of regions, in the context of a step, laid out on a grid.
     */
    LayoutManager.prototype.registerLayout = function (step, gridList) {
      var index, fn;
      var grid = gridList.getItem(step.grid);
      var layout = new RLD.Layout({
        'regionList': this.regionList,
        'step': step,
        'grid': grid
      });
      this.layouts.push(layout);
      // Update Managers
      this.stepManager.addItem(step);
    };
    /**
     *
     */
    LayoutManager.prototype.switchStep = function (event) {
      var step = this.stepManager.info('activeStep');
      var id = this.stepManager.info('activeStep').info('breakpoint');
      var $screen = this.$layouts.find('.screen');
      var i, layout, lstep;
      $screen.children().remove();
      // Get the active step and layout.
      for (i = 0; i < this.layouts.length; i++) {
        layout = this.layouts[i];
        lstep = layout.step;
        if (lstep['machine_name'] === step['machine_name']) {          
          this.$layouts.find('.screen').append(
            this.layouts[i].build()
          );
        }
      }
    };
    
    return LayoutManager;
    
  }());

}(ResponsiveLayoutDesigner, jQuery));