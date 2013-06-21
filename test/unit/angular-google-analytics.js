/* global module, angular, console, describe, expect, it, before, beforeEach, inject, spyOn, AnalyticsProvider */

'use strict';

describe('angular-google-analytics', function(){
  var _Analytics,
      _$rootScope;

  beforeEach(module('angular-google-analytics'));

  describe('automatic trackPages', function() {

    beforeEach(module(function(AnalyticsProvider) {
      AnalyticsProvider.setAccount('UA-XXXXXX-xx');
    }));

    beforeEach(inject(function(Analytics, $rootScope) {
      _Analytics = Analytics;
      spyOn(_Analytics, "_push");
      _$rootScope = $rootScope;
    }));

    it('should inject the GA script', function() {
      expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(1);
    });

    it('should generate pageTracks', function() {
      expect(_Analytics._push).not.toHaveBeenCalled();
      _Analytics.trackPage('test');
      expect(_Analytics._push.callCount).toBe(1);
      _Analytics.trackEvent('test');
      expect(_Analytics._push.callCount).toBe(2);
    });

    it('should generate an trackpage to routeChangeSuccess', function() {
      _$rootScope.$broadcast('$routeChangeSuccess');
      expect(_Analytics._push.callCount).toBe(1);
    });
  });

  describe('NOT automatic trackPages', function() {
    beforeEach(module(function(AnalyticsProvider) {
      AnalyticsProvider.setAutoTrackRoutes(false);
      AnalyticsProvider.setAccount('UA-XXXXXX-xx');
    }));

    beforeEach(inject(function(Analytics, $rootScope) {
      _Analytics = Analytics;
      spyOn(_Analytics, "_push");
      _$rootScope = $rootScope;
    }));

    it('should NOT generate an trackpage to routeChangeSuccess', function() {
      _$rootScope.$broadcast('$routeChangeSuccess');
      expect(_Analytics._push).not.toHaveBeenCalled();
    });
  });

});

