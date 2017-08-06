/*jshint esversion: 6 */
const stats = require('./lib/stats');
var Noditor = function () {};
var quiet = true;
var passcode = null;
const ERR = 'Noditor ERROR >';
const PAUSED = 'Noditor has been paused';


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
 * @param  {Function} next
 * @return {void}
 */
Noditor.prototype.commands = function (req, res, next) {
  try{
    // Check for passcode
    if(passcode && req.params.passcode !== passcode){
      throw 'Invalid passcode';
    }

    if(req.params.command === 'stats'){
      console.log(req.params);
      if(stats.isRunning()){
        res.send(stats.getStats());
      }
      else{
        res.status(409, PAUSED);
        res.send({status:PAUSED});
      }
      next();
    }
    else if(req.params.command === 'top'){
      if(stats.isRunning()){
        res.send(stats.getTop());
      }
      else{
        res.status(409, PAUSED);
        res.send({status:PAUSED});
      }
      next();
    }
    else if(req.params.command === 'stop'){
      stats.stop();
      res.send({"status":"OK"});
      next();
    }
    else if(req.params.command === 'start'){
      if(stats.isRunning()){
        stats.stop();
      }
      stats.start(req.params.options);
      res.send({"status":"OK"});
      next();
    }
    else {
      throw 'Bad Command';
    }
  }
  catch(err){
    if(!quiet) console.log(ERR, 'Noditor.commands', err);
    res.status(500);
    res.send({status:err});
    next();
  }
};


// Export the anonymous object
module.exports = new Noditor();
