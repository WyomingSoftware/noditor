# Please do not install. Still a work in progress.
The Noditor Mobile App is under development. Installing the Noditor Node Module
will only collect stats but there is no way to view them for now.


---



## Noditor
The Noditor Node Module gathers stats and
serves the data to the Noditor App upon request. It only retains a small set of stats
of a Node.js App. The size of the stats retained can be altered.

The Noditor Node Module is simple by design and places very little overhead on the host Node.js App.
It uses just a tiny amount of memory and CPU usage is undetectable.

Noditor as a monitoring system is not a replacement for the big boy monitors
but it does not overwhelm a Node.js App like some do.
It provides just enough insight to know if you have an issue. You know best what to do then.

When ready the Noditor Mobile App will be able to directly access the stats retained by a Node.js App
that uses the Noditor Node Module. Both iOS and Android will be available. Near real-time charts will show
stats for Memory, CPU, and other usage.


## Installation
```
npm install noditor --save
```




## Start/Stop Noditor
Usage is very basic. You can start (w/options) and stop Noditor.
```
var noditor = require('noditor');

// Start with default options
noditor.start();

// Start with custom options
var options = {
    "stats_size":10,
    "stats_frequency":15,
    "passcode":"my_secret",
    "quiet":false
  };
noditor.start(options);
```


* **stats_size:** (number) Defaults to 10. The Noditor Node Module maintains an array of stats inside a Node.js
App. The default size of the array is 10 rows. This array of stats is then delivered to the Noditor Mobile App. The array size can be increased to display a graph in the Noditor Mobile App of longer duration.

* **stats_frequency:** (number) Defaults to 15. The frequency in seconds that stats are collected. This value cannot be less than 5 seconds.

* **passcode:** (string) Defaults to null. Adds a passcode to protect the /noditor/: endpoint (route). The Noditor Mobile App
must pass the passcode when accessing the endpoint. There is no private or identifying data that the Noditor Node Module collects. Passcode protection is optional.

* **quiet:** (boolean) Defaults to true. The Noditor Node Module swallows any errors it encounters. Setting the
quiet parameter to true would output those errors to console along with a few operational messages such as start
and stop.


If the Stats Collection (stats_size) is 10 rows and the Stats Frequency (stats_frequency)
is 15 seconds then there will be 150 seconds of stats
to draw memory and other charts at 15 minute increments up to 2.5 minutes. Adjust the options to get the
chart needed.



## Noditor Mobile App Access
The Noditor Mobile App can access the stats that the Noditor Node Module has gathered.
To do so an endpoint (route) must be declared inside a Node.js App for the Noditor Mobile App to call.

The following code has been verify to work with Restify and Express. Please open an issue if another
framework does not work. Please note the ':' that trails the URI parameter.

```
server.get('/noditor/:', noditor.commands);
```





## Load Balancers
Node.js Apps that are load balanced between more than one server require special attention
if access is required via the Internet.
