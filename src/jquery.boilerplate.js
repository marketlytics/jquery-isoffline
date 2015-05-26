// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Element functions and data can be accessed using the data function
		// $(document).data('plugin_isOffline').isOffline => returns the current state

		// Create the defaults once
		var pluginName = "isOffline";
		var defaults = {
				interval: 30000,
				timeout: 10000,
				baseUrl: "/favicon.ico",
				triggerEventOffline: "isOffline",
				triggerEventOnline: "isOnline"
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.isOffline = true;

				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;

				this.check = function() {
					this.checkConnection();
				}

				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {

				wentOnline: function() {
					if(this.isOffline) {
						$(this.element).trigger(this.settings.triggerEventOnline);
					}
					this.isOffline = false;
				},

				wentOffline: function() {
					if(!this.isOffline) {
						$(this.element).trigger(this.settings.triggerEventOffline);
					}
					this.isOffline = true;
				},

				checkConnection: function() {
					var _this = this;
					$.ajax({
						timeout: this.settings.timeout,
						cache: false,
						context: this,
						url: this.settings.baseUrl,
						success:  this.wentOnline,
						error: this.wentOffline
					});

					if(this.settings.interval > 0) { // only use interval if interval is a valid number
						setTimeout(function() {
							_this.checkConnection(); // needs to be done to maintain the context
						}, this.settings.interval);
					}
				},

				init: function() {
						this.checkConnection();
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( $, window, document );
