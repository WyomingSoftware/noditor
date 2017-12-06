## Noditor Monitoring System
There are three components to Noditor as a monitoring system.

* **Node.js App** (Your server app)
* **Noditor Module** (Stats collection node_module for your app)
* **Noditor Mobile App** (iOS and Android app to display stats)

Your **Node.js App** will host the Noditor Module to collect stats.

The **Noditor Module** is simple by design and places very little overhead on a host Node.js App.
It uses just a tiny amount of memory and CPU usage is nearly undetectable. The Noditor Module gathers stats and
serves the data to the Noditor Mobile App, CURL and other HTTP requests. It retains a small set of data inside a Node.js App. The size of the data retained can be altered.

The **Noditor Mobile App** accesses the stats gathered by the Noditor Module.

Noditor as a monitoring system is not a replacement for the big boy monitors
but it does not overwhelm a Node.js App like they do.
It provides just enough insight to know if you have an issue. You know best what to do then.

The Noditor Module and Noditor Mobile App are free and open source.



## Noditor Mobile App
The Noditor Mobile App accesses the stats retained by the Noditor Module installed for a Node.js App. Both iOS and Android are available on the App and Play Stores. Near real-time charts will show stats for Memory, CPU and other usage.

You can try the Noditor Mobile App without adding the Noditor Module to your Node.js App. The
Noditor Mobile App has access to two demo servers running the Noditor Module.

![App Stores](https://raw.githubusercontent.com/WyomingSoftware/noditor-mobile/master/non-app-assets/appstores-small.jpg)

The **[Noditor Mobile App](https://github.com/WyomingSoftware/noditor-mobile)** source code is available on GitHub.


## Requirements
The Noditor Module requires **[Node.js](https://nodejs.org)** version 6.1 or higher.



## Installation
```bash
npm install noditor --save
```




## Start/Stop Noditor Module
Usage is very basic. Call start (with or without options) and stop functions from within a Node.js App to
start and stop stats collection. The Noditor Mobile App can also start and stop stats collection.
```javascript
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

// Start with declared options using a passcode from process.env
// PASSCODE was passed to Node.js (PASSCODE=1234 node server.js)
var options = {
    "stats_size":10,
    "stats_frequency":15,
    "passcode":process.env.PASSCODE,
    "quiet":false
  };
noditor.start(options);

// Stop
noditor.stop();
```


* **stats_size:** (number) Defaults to 10. The Noditor Module maintains an array of stats inside a Node.js
App. The default size of the array is 10 rows. This array of stats is then delivered to the Noditor Mobile App. The array size can be increased to display a graph in the Noditor Mobile App of longer duration.

* **stats_frequency:** (number) Defaults to 15. The frequency in seconds that stats are collected. This value cannot be less than 5 seconds.

* **passcode:** (string) Defaults to null. Adds a passcode to protect the /noditor/:path/:passcode/:command endpoint (route). There is no private data that the Noditor Module collects. Passcode protection is optional. If a passcode is used then be sure the Node.js App uses SSL for at least the /noditor/:path/:passcode/:command endpoint. Self-signed certs will not work with the Noditor Mobile App. Use http when using a self-signed cert if the Noditor Mobile App is used. This is usually the case in development and is not recommended for production.

* **quiet:** (boolean) Defaults to true. The Noditor Module swallows any errors it encounters. Setting the
quiet parameter to false would output errors to console along with a few operational messages such as start
and stop.


If the Stats Collection (stats_size) is 10 rows and the Stats Frequency (stats_frequency)
is 15 seconds then there will be 150 seconds of stats
to draw memory and other charts at 15 minute increments up to 2.5 minutes. Adjust the options to get the
charts needed.



## Endpoint (Route)
The Noditor Mobile App and CURL can access the stats that the Noditor Module has gathered from within a Node.js App.
To do so an endpoint (route) must be declared inside the Node.js App for the Noditor Mobile App and CURL to call.

The following route has been verified to work with Restify and Express. Please open an issue if another
framework does not work.
```javascript
// Restify
server.get('/noditor/:path/:passcode/:command', noditor.commands);

// Express
app.get('/noditor/:path/:passcode/:command', noditor.commands);
```

See the **Example Node.js App Projects** section at the bottom of this README for sample code.


## CURL
Access the stats within a Node.js App running the Noditor Module using CURL.

URL structure: /noditor/:path/:passcode/:command

The :command determines the
content of the returned JSON Object. If the Node.js App was started without a :passcode then
the :passcode in the URL is ignored. The :path is also ignored and exists only for use by load balancers.


There are three required values to be passed in the URL.

**:path** > This is a placeholder for your load balancer to use and direct the URL to the
proper server. It is ignored by the Noditor Module. If you are not directing the URL with a
load balancer simply put a dummy value here.
```bash
# bear is used by the load balancer to direct the endpoint call
curl -k https://www.my_domain.com/noditor/bear/my_passcode/top

# none is used as a dummy value since the load balancer does not look at the endpoint call
curl -k https://www.my_domain.com/noditor/none/my_passcode/top

```

**:passcode** > If you started the Noditor Module with a passcode you
will need to place it here. If you did not then simply use a dummy string as it will be ignored by Noditor.
```bash
# push123_code was used to start noditor and must be passed as the passcode
curl -k https://www.my_domain.com/noditor/my_path/push123_code/top

# none is used as a dummy value since noditor was not started with a passcode and will ignore the passcode
curl -k https://www.my_domain.com/noditor/my_path/none/top

```

**:command** > (stats, top, start, stop)
* stats - returns an array of stats
* top - return the last stat
* start - begins the collection of stats by the Noditor Module
* stop - halts the collection of stats by the Noditor Module

**Full CURL examples:**
```bash
curl http://www.my_domain.com/noditor/my_path/my_passcode/top

# With JSON pretty print
curl http://www.my_domain.com/noditor/my_path/my_passcode/top | python -m json.tool

# With header details
curl -v http://www.my_domain.com/noditor/my_path/my_passocode/top

# ssl with valid certificate
curl -v https://www.my_domain.com/noditor/my_path/my_passocode/top

# ssl with self signed certificate
# (self signed certs will not work with the mobile app)
curl -v -k https://www.my_domain.com/noditor/my_path/my_passocode/top
```


## Load Balancers
Node.js Apps that are load balanced between more than one server require special attention
if access is required via the Internet from the Noditor Mobile App. Use the :path
(first) parameter of the URL as a tag that the load balancer can use to direct the
inbound call. The :path is the first parameter of the URL (/noditor/:path/:passcode/:command).

**:path** > This is a placeholder for your load balancer to use and direct the URL to the
proper server. It is ignored by the Noditor Module. If you are not directing the URL with a
load balancer use a dummy value.

The value bear as the first parameter in the URL could be used by a load
balancer to direct the call to a specific server.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*www.my_domain.com/noditor/bear/my_passcode/top*

If the load balancer is not examining the URL for routing purposes simply use any value
for the path parameter. Here the word none is used.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*www.my_domain.com/noditor/none/my_passcode/top*



## CORS
Most likely you already have CORS implemented in your Node.js App. You may or may not
need to use CORS based on your project's specific environment.


## Example Node.js App Projects
Example projects have been created to show how to add the Noditor Module to your Node.js App.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[noditor-server-restify](https://github.com/WyomingSoftware/noditor-server-restify)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[noditor-server-express](https://github.com/WyomingSoftware/noditor-server-express)

This project is the actual Node.js App used for the demo servers in the Noditor Mobile App. It does use
CORS.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[noditor-server-demo](https://github.com/WyomingSoftware/noditor-server-demo)
