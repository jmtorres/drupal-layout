(function (RLD, $) {
  // Temp location.
  RLD['RegionSet'] = (function () {

    function RegionSet() {
      this.options = {};
      this.items = [];
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    RegionSet.prototype = new RLD.InitClass();
    /**
     *
     */
    RegionSet.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      // Format the regions.
      this.processList(this.regions);
    };
    /**
     *
     */
    RegionSet.prototype.build = function () {
      return this.$editor;
    };
    /**
     *
     */
    RegionSet.prototype.info = function (property, value) {      
      if (property in this) {
        if (value !== undefined) {
          this[property] = value;
          return;
        }
        return this[property];
      }
      return;
    };
    /**
     *
     */
     RegionSet.prototype.processList = function (items) {
      var item;
      for (item in items) {
        if (items.hasOwnProperty(item)) {
          this.items.push(new RLD.Region({
            'name': items[item],
            'machine_name': item
          }));
        }
      }
    };
    /**
     *
     */
    RegionSet.prototype.update = function (regionSet) {
      this.regionItems = regionSet;
      this.triggerEvent('regionOrderUpdated', this);
    };

    return RegionSet;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
