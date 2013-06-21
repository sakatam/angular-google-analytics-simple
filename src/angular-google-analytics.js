/* global angular, console */

'use strict';

angular.module('angular-google-analytics', [])
.provider('analytics', function() {
  var trackRoutes = true,
      account;

  // config methods
  this.setAccount = function(_account) {
    account = _account;
  };

  this.setAutoTrackRoutes = function(_trackRoutes) {
    trackRoutes = _trackRoutes;
  };

  // public service
  this.$get = ['$document', '$rootScope', '$location', '$window', function($document, $rootScope, $location, $window) {
    if (!account) {
      throw new Error("account must be set before injecting");
    }

    // inject the google analytics tag
    $window._gaq = $window._gaq || [];
    (function() {
      var document = $document[0];
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

    // wrap _gaq.push for testing
    this.push = function(arr) {
      $window._gaq && $window._gaq.push(arr);
    };

    this.push(['_setAccount', account]);

    if (trackRoutes) {
      this.push(['_trackPageview']);
    }

    // activates page tracking
    if (trackRoutes) {
      $rootScope.$on(
        '$routeChangeSuccess',
        (function () { this.push(['_trackPageview', $location.path()]); }).bind(this)
      );
    }

    return this;
  }];
});

