/*jshint esversion: 6 */
var os = require('os');
var Stats = function () {};
var intervalTimer = null;
var stats_size =  10;
var stats_frequency =  15000;
var quiet = true;
var stats = [];
var peakHeapTotal = 0;
var peakHeapUsed = 0;
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
Stats.prototype.start = function (options) {
  try{
    if(options){
      stats_size = options.stats_size || 10;
      stats_frequency = options.stats_frequency*1000 || 15000;
      if(typeof options.quiet == 'boolean') {
        quiet = options.quiet;
      }
    }

    // If the app accidentally sends a value under 5 seconds correct the value.
    if(stats_frequency < 5){
        stats_frequency = 15000;
    }

    // Only one intervalTimer can be running
    if(intervalTimer === null){
        intervalTimer = setInterval(function () {
            try{

                // Data
                var data = {"dttm":Date.now(),
                    "nodeVersion":process.version,
                    "uptime":process.uptime(),
                    "memoryUsage":process.memoryUsage(),
                    "osFreemem":os.freemem(),
                    "osTotalmem":os.totalmem(),
                    "process":process.cpuUsage()
                };

                // Set peak values
                if(data.memoryUsage.heapTotal > peakHeapTotal) peakHeapTotal = data.memoryUsage.heapTotal;
                if(data.memoryUsage.heapUsed > peakHeapUsed) peakHeapUsed = data.memoryUsage.heapUsed;

                // Add to stats array
                stats.push(data);
                if(stats.length > stats_size){
                  stats.shift();
                }
            }
            catch(err){
              if(!quiet) console.log(ERR, 'Stats.start.intervalTimer', err);
            }
        }, stats_frequency);
        if(!quiet) console.log('Noditor > started');
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
    if(!quiet) console.log('Noditor > stopped');
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
    if(intervalTimer != null){
      return {
        "peakHeapUsed":peakHeapUsed,
        "peakHeapTotal":peakHeapTotal,
        "stats":stats
      };
    }
    else{

    }

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
        "peakHeapUsed":peakHeapUsed,
        "peakHeapTotal":peakHeapTotal,
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
    if(intervalTimer != null)return true;
    else return false;
  }
  catch(err){
    throw err;
  }
};


// Export an anonymous object
module.exports = new Stats();
