/*jshint esversion: 6 */
var os = require('os');
var Stats = function () {};
var intervalTimer = null;
var stats_size =  10;
var stats_frequency =  15000;
var quiet = true;
var stats = [];
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
                var data = {"dttm":Date.now(),
                    "processMemoryUsage":process.memoryUsage(),
                    "osFreemem":os.freemem(),
                    "osTotalmem":os.totalmem()
                };
                stats.push(data);
                if(stats.length > stats_size){
                  stats = stats.slice(0, stats_size);
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
 * @return {Array} stats collections
 */
Stats.prototype.get = function () {
  try{
    return stats;
  }
  catch(err){
    throw err;
  }
};


// Export an anonymous object
module.exports = new Stats();
