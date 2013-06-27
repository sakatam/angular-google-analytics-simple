/* global module, angular, console, describe, expect, it, jasmine, before, beforeEach, inject, spyOn, analyticsProvider */

'use strict';

describe('angular-google-analytics', function () {
  beforeEach(module('angular-google-analytics-simple'));

  describe('initialize', function () {
    it('should throw if account is not set', function () {
      inject(function ($injector) {
        expect(function () { $injector.get("analytics"); }).toThrow();
      });
    });

    it('should inject the GA script', function () {
      module(function (analyticsProvider) {
        analyticsProvider.setAccount('UA-XXXXXX-xx');
      });

      inject(function (analytics) {
        expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(0);
        analytics.initialize();
        expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(1);
      });
    });
  });

  describe("tracking methods", function () {
    beforeEach(module(function (analyticsProvider) {
      analyticsProvider.setAccount('UA-XXXXXX-xx');
    }));

    describe('automatic trackPages', function () {
      beforeEach(inject(function (analytics) {
        analytics.initialize();
        spyOn(analytics, "push");
      }));

      it('should generate an trackpage to routeChangeSuccess', inject(function (analytics, $rootScope) {
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(analytics.push.callCount).toBe(1);
      }));
    });

    describe('NOT automatic trackPages', function() {
      beforeEach(module(function (analyticsProvider) {
        analyticsProvider.autoTrack(false);
      }));

      beforeEach(inject(function (analytics) {
        analytics.initialize();
        spyOn(analytics, "push");
      }));

      it('should NOT generate an trackpage to routeChangeSuccess', inject(function (analytics, $rootScope) {
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(analytics.push).not.toHaveBeenCalled();
      }));
    });

    describe('push', function () {
      it("should be a bypass to window._gaq.push", function () {
        var mockGaq = { push: jasmine.createSpy() };

        inject(function ($window) {
          $window._gaq = mockGaq;
        });

        inject(function (analytics) {
          analytics.initialize();
          analytics.push("test");
        });

        expect(mockGaq.push.calls.length).toBe(2);
        expect(mockGaq.push.calls[0].args[0]).toEqual(["_setAccount", "UA-XXXXXX-xx"]);
        expect(mockGaq.push.calls[1].args[0]).toEqual("test");
      });
    });
  });

});

