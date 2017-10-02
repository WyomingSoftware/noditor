/*jshint esversion: 6 */
var os = require('os');
var Stats = function () {};
var intervalTimer = null;
var stats = [];
var options = {stats_size:10, stats_frequency:15000, passcode:null, quiet:true};
var peaks = {
  peakHeapTotal:0,
  peakHeapUsed:0,
  peakHeapTotalDttm:null,
  peakHeapUsedDttm:null
};
const ERR = 'Noditor ERROR >';


/**
 * Starts the Noditor timer that gathers stats.
 * Only one instance of the intervalTimer can be running.
 *
 * @param  {object} options
 * -- list of startup options --
 * stats_size:number      (optional: defaults 10)
 * stats_frequency:number (optional: defaults 15 seconds)
 * passcode:string        (optional: defaults none)
 * quiet:boolean          (optional: defaults true)
 *
 * @return {void}
 */
Stats.prototype.start = function (opts) {
  try{
    // Support for versions 6, 8
    if(process.version.substr(0,2) != 'v8' &&
       process.version.substr(0,2) != 'v6'){
      throw "Noditor only supports Node.js versions 6x and 8x.";
    }
    if(opts){
      options.stats_size = opts.stats_size || 10;
      options.stats_frequency = opts.stats_frequency || 15;
      if(typeof opts.quiet == 'boolean') {
        options.quiet = opts.quiet;
      }
      // If the app sends a value under 5 seconds correct the value.
      if(options.stats_frequency < 5){
          options.stats_frequency = 5;
      }
    }


    // Only one intervalTimer can be running
    if(intervalTimer === null){
      intervalTimer = setInterval(function () {
        try{
            var now = Date.now();
            // Data
            var data = {"dttm":now,
                "hostname":os.hostname() || 'Unknown',
                "nodeVersion":process.version,
                "uptime":process.uptime(),
                "memoryUsage":process.memoryUsage(),
                "osFreemem":os.freemem(),
                "osTotalmem":os.totalmem(),
                "process":process.cpuUsage()
            };

            // Set peak values
            if(data.memoryUsage.heapTotal > peaks.peakHeapTotal){
              peaks.peakHeapTotal = data.memoryUsage.heapTotal;
              peaks.peakHeapTotalDttm = now;
            }
            if(data.memoryUsage.heapUsed > peaks.peakHeapUsed){
              peaks.peakHeapUsed = data.memoryUsage.heapUsed;
              peaks.peakHeapUsedDttm = now;
            }

            // Add to stats array
            stats.push(data);
            if(stats.length > options.stats_size){
              stats.shift();
            }
          }
          catch(err){
            if(!options.quiet) console.log(ERR, 'Stats.start.intervalTimer', err);
          }
      }, options.stats_frequency*1000);
      if(!options.quiet) console.log('Noditor > started');
    }
    else{
      throw "Tried to start Noditor when already running.";
    }
  }
  catch(err){
    throw err;
  }
};


/**
 * Stops the Noditor timer that collects stats.
 * @return {void}
 */
Stats.prototype.stop = function () {
  try{
    clearInterval(intervalTimer);
    intervalTimer = null;
    if(!options.quiet) console.log('Noditor > stopped');
  }
  catch(err){
    throw err;
  }
};


/**
 * Returns the stats colelction.
 * @return {Object} stats collections
 */
Stats.prototype.getStats = function () {
  try{
    return {
      "options":options,
      "peaks":peaks,
      "stats":stats
    };
  }
  catch(err){
    throw err;
  }
};


/**
 * Returns the last stat.
 * @return {Object} stat
 */
Stats.prototype.getTop = function () {
  try{
      return {
        "options":options,
        "peaks":peaks,
        "stats":stats[stats.length-1]
      };
  }
  catch(err){
    throw err;
  }
};

/**
 * Returns state of the interval.
 * @return {boolean} flag
 */
Stats.prototype.isRunning = function () {
  try{
    if(intervalTimer != null) return true;
    else return false;
  }
  catch(err){
    throw err;
  }
};


// Export an anonymous object
module.exports = new Stats();
