/* global module, angular, console, describe, expect, it, before, beforeEach, inject, spyOn, AnalyticsProvider */

'use strict';

describe('angular-google-analytics', function () {
  beforeEach(module('angular-google-analytics'));

  describe('instantiation', function () {
    it('should throw', function () {
      inject(function ($injector) {
        expect(function () { $injector.get("Analytics"); }).toThrow();
      });
    });

    it('should inject the GA script', function () {
      module(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount('UA-XXXXXX-xx');
      });

      inject(function (Analytics) {
        expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(1);
      });
    });
  });

  describe("tracking methods", function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount('UA-XXXXXX-xx');
    }));

    describe('automatic trackPages', function () {
      beforeEach(inject(function (Analytics) {
        spyOn(Analytics, "push");
      }));

      it('should generate an trackpage to routeChangeSuccess', inject(function (Analytics, $rootScope) {
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(Analytics.push.callCount).toBe(1);
      }));
    });

    describe('NOT automatic trackPages', function() {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.setAutoTrackRoutes(false);
      }));

      beforeEach(inject(function (Analytics) {
        spyOn(Analytics, "push");
      }));

      it('should NOT generate an trackpage to routeChangeSuccess', inject(function (Analytics, $rootScope) {
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(Analytics.push).not.toHaveBeenCalled();
      }));
    });

    describe('push', function () {
      it("should be a bypass to window._gaq.push", function () {
        var mockGaq = { push: jasmine.createSpy() };

        inject(function ($window) {
          $window._gaq = mockGaq;
        });

        inject(function (Analytics) {
          Analytics.push("test");
        });

        expect(mockGaq.push.calls.length).toBe(3);
        expect(mockGaq.push.calls[0].args[0]).toEqual(["_setAccount", "UA-XXXXXX-xx"]);
        expect(mockGaq.push.calls[1].args[0]).toEqual(["_trackPageview"]);
        expect(mockGaq.push.calls[2].args[0]).toEqual("test");
      });
    });
  });

});

