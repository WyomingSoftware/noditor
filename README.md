# Please do not install. Still a work in progress.
The Noditor Mobile App is under development. Installing the Noditor Node Module
will only collect stats but there is no way to view them for now.


---



## Noditor
The Noditor Node Module gathers stats and
serves the data to the Noditor Mobile App upon request. It only retains a small set of stats
inside a Node.js App. The size of the stats retained can be altered.

There are three components to Noditor as a monitoring system.

* **Node.js App** (Your app)
* **Noditor Node Module** (Stats collection node_module for your app)
* **Noditor Mobile App** (iOS and Android apps to display stats)

The Noditor Node Module is simple by design and places very little overhead on a host Node.js App.
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
Usage is very basic. Call start (w/options) and stop functions from within a Node.js App to
start and stop stats collection. The Noditor Mobile App can also start and stop stats collection.
```
var noditor = require('noditor');

// Start with default options
noditor.start();

// Start with declared options
var options = {
    "stats_size":10,
    "stats_frequency":15,
    "passcode":"my_secret",
    "quiet":false
  };
noditor.start(options);

// Stop
noditor.stop();
```


* **stats_size:** (number) Defaults to 10. The Noditor Node Module maintains an array of stats inside a Node.js
App. The default size of the array is 10 rows. This array of stats is then delivered to the Noditor Mobile App. The array size can be increased to display a graph in the Noditor Mobile App of longer duration.

* **stats_frequency:** (number) Defaults to 15. The frequency in seconds that stats are collected. This value cannot be less than 5 seconds.

* **passcode:** (string) Defaults to null. Adds a passcode to protect the /noditor/:passcode/:command endpoint (route). There is no private data that the Noditor Node Module collects. Passcode protection is optional. If a passcode is used then be sure the Node.js App use SSL for at least the /noditor/:passcode/:command endpoint.

* **quiet:** (boolean) Defaults to true. The Noditor Node Module swallows any errors it encounters. Setting the
quiet parameter to false would output errors to console along with a few operational messages such as start
and stop.


If the Stats Collection (stats_size) is 10 rows and the Stats Frequency (stats_frequency)
is 15 seconds then there will be 150 seconds of stats
to draw memory and other charts at 15 minute increments up to 2.5 minutes. Adjust the options to get the
chart needed. The stats_size and stats_frequency parameters can also be adjusted at runtime using the Noditor
Mobile App.



## Example Node.js App Projects
Example projects have been created to show how to add the Noditor Node Module to your Node.js App.

   [noditor-server-restify](https://github.com/WyomingSoftware/noditor-server-restify)

   [noditor-server-express](https://github.com/WyomingSoftware/noditor-server-express)

   [Restify](http://www.restify.com/)

   [Express](http://www.expressjs.com/)



## Noditor Mobile App Access
The Noditor Mobile App can access the stats that the Noditor Node Module has gathered.
To do so an endpoint (route) must be declared inside a Node.js App for the Noditor Mobile App to call.

The following route has been verified to work with Restify and Express. Please open an issue if another
framework does not work.

```
server.get('/noditor/:passcode/:command', noditor.commands);
// OR
app.get('/noditor/:passcode/:command', noditor.commands);
```

## CURL
Access the stats within your Node.js App using CURL. The action command determines the
content of the returned JSON Object. If the Node.js App was started without a passcode then
the passcode in the URL is ignored.

```
curl -i  -X GET "http://localhost:8080/noditor/my_passcode/stats"
```



## Load Balancers
Node.js Apps that are load balanced between more than one server require special attention
if access is required via the Internet. Later releases of the Noditor Node Module will contain
instructions on how to implement access with HAProxy.
