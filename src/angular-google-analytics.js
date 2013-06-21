/* global angular, console */

'use strict';

angular.module('angular-google-analytics', [])
.provider('Analytics', function() {
  var created = false,
      trackRoutes = true,
      accountId;

  // config methods
  this.setAccount = function(id) {
    accountId = id;
  };

  this.setAutoTrackRoutes = function(_trackRoutes) {
    trackRoutes = _trackRoutes;
  };

  // public service
  this.$get = ['$document', '$rootScope', '$location', '$window', function($document, $rootScope, $location, $window) {
    // private methods
    function _createScriptTag() {
      // inject the google analytics tag
      if (!accountId) return;
      $window._gaq = $window._gaq || [];
      $window._gaq.push(['_setAccount', accountId]);
      if (trackRoutes) $window._gaq.push(['_trackPageview']);
      (function() {
        var document = $document[0];
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
      created = true;
    }

    // for testing
    this._push = function() {
      $window._gaq && $window._gaq.push(arguments);
    };
    this.trackPage = function(url) {
      this._push(['_trackPageview', url]);
    };
    this.trackEvent = function(category, action, label, value) {
      this._push(['_trackEvent', category, action, label, value]);
    };

    // creates the ganalytics tracker
    _createScriptTag();

    // activates page tracking
    if (trackRoutes) {
      $rootScope.$on(
        '$routeChangeSuccess',
        (function () { this.trackPage($location.path()); }).bind(this)
      );
    }

    return this;
  }];
});

