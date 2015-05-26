jQuery isOffline
=========


This is a simple, minimalistic library design to keep tabs on the connectivity of your web application. It uses `AJAX` to check if you are currently offline or online and triggers the events likewise. You can also trigger the check manually or set an interval. There is a demo inside the app, which is also hosted [here](http://dev.marketlytics.com/offline/demo).

You can tweak the following defaults:

```

interval: 30000 // if interval is 0 then it will not check automatically
timeout: 10000 // timeout for AJAX call
baseUrl: "/favicon.ico" // URL to ping to for checking, preferrably should be on the same domain
triggerEventOffline: "isOffline"
triggerEventOnline: "isOnline"

```

and to get started all you need to do is initialize it:

```
// it is recommended to bind to document, tho you can use any element here.
$(document).isOffline({ interval: 15000, baseUrl: "http://dev.marketlytics.com/offline/sample" });


```
to get notified of the changes simple use the bind function:

```
$(document).bind('isOnline', function() {
    console.log('The app is online!');
})
.bind("isOffline", function() {
    console.log("This app is offline!");
});

```
