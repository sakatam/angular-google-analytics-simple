/* global angular, console */

'use strict';

angular.module('angular-google-analytics-simple', [])
.provider('analytics', function() {
  var trackRoutes = true,
      account,
      initialized = false;

  // config methods
  this.setAccount = function(_account) {
    account = _account;
  };

  this.autoTrack = function(_trackRoutes) {
    trackRoutes = _trackRoutes;
  };

  // public service
  this.$get = ['$document', '$rootScope', '$location', '$window', function($document, $rootScope, $location, $window) {
    if (!account)
      throw new Error("account must be set before injecting");

    // wrap _gaq.push for testing
    this.push = function(arr) {
      if(!initialized)
        throw new Error("initialize must be called before sending data");

      $window._gaq && $window._gaq.push(arr);
    };

    this.initialize = function() {
      // inject the google analytics tag
      $window._gaq = $window._gaq || [];
      (function() {
        var document = $document[0];
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();

      initialized = true;

      this.push(['_setAccount', account]);
    };

    // activates page tracking
    if (trackRoutes) {
      $rootScope.$on(
        '$routeChangeSuccess',
        function () {
          this.push(['_trackPageview', $location.path()]);
        }.bind(this)
      );
    }

    return this;
  }];
});
