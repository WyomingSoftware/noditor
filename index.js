/*jshint esversion: 6 */
const stats = require('./lib/stats');
var Noditor = function () {};
var quiet = true;
var passcode = null;
const ERR = 'Noditor ERROR >';


/**
 * For use by the host Node.js App to start the stats
 * collecion at runtime.
 *
 * var noditor = require('../noditor');
 * noditor.start();
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
Noditor.prototype.start = function (options) {
  try{
    if(options){
      passcode = options.passcode || null;
      if(typeof options.quiet == 'boolean') {
        quiet = options.quiet;
      }
    }

    stats.start(options);
  }
  catch(err){
    if(!quiet) console.log(ERR, 'Noditor.start', err);
  }
};


/**
 * For use by the host Node.js App to stop the stats
 * collecion at runtime.
 * @return {void}
 */
Noditor.prototype.stop = function () {
  try{
    stats.stop();
  }
  catch(err){
    if(!quiet) console.log(ERR, 'Noditor.stop', err);
  }
};


/**
 * Function to attach to a /noditor/: endpoint by a host Node.js App. Looks for
 * certain query parameters attached to the request to process.
 *
 * passcode => Required if the Noditor Node Module was started with a passcode.
 * stats => Will return the stats array
 * top => Will return the last stat from the stats array
 * start => Starts stats collection
 * stop => Stops stats collection
 *
 * @param  {Object}   req  HTTP Request
 * @param  {Object}   res  HTTP Response
 * @param  {Function} next [description]
 * @return {void}
 */
Noditor.prototype.commands = function (req, res, next) {
  try{
    // Check for passcode
    if(passcode && req.params.passcode !== passcode){
      throw 'Invalid passcode';
    }

    if(req.params.action === 'stats'){
      res.send({"len":stats.get().length, 'stats':stats.get()});
      next();
    }
    else if(req.params.action === 'top'){
      // Return only the newest stat
      res.send({"stats":stats.get()[stats.get().length-1]});
      next();
    }
    else if(req.params.action === 'stop'){
      stats.stop();
      res.send({"status":"OK"});
      next();
    }
    else if(req.params.action === 'start'){
      stats.start(req.params.options);
      res.send({"status":"OK"});
      next();
    }
    else {
      res.status(500);
      res.send({"status":"Bad Command"});
      next();
    }
  }
  catch(err){
    if(!quiet) console.log(ERR, 'Noditor.commands', err);
    res.status(500);
    res.send(err);
    next();
  }
};


// Export the anonymous object
module.exports = new Noditor();
