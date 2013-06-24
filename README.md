# angular-google-analytics-simple

Super simple AngularJS service for Google Analytics tracker.

## Features
+ Transparent access to the "_gaq" object
+ Automatic page tracking

## Example

```js
var app = angular.module('app', ['angular-google-analytics-simple'])
    .config(function(analyticsProvider, function() {
        // initial configuration
        analyticsProvider.setAccount('UA-XXXXX-xx');

        // automatically track all routes
        analyticsProvider.autoTrack(true);
    }))
    .run(function(analytics) {
        // init the module to inject GA tag
        analytics.initialize();
    })
    .controller('SampleController', function(analytics) {
        // create a new pageview event
        analytics.push(['_trackPageview', '/video/detail/XXX']);

        // create a new tracking event
        analytics.push(['_trackEvent', 'video', 'play', 'django.mp4']);
    });
```

## Licence
As AngularJS itself, this module is released under the permissive [MIT license](http://revolunet.mit-license.org). Your contributions are always welcome.
