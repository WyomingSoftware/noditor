var Noditor = function () {};

// https://darrenderidder.github.io/talks/ModulePatterns/#/6

Noditor.prototype.start = function () {
  console.log('\nNoditor started\n');
};

// Export an anonymous object
module.exports = new Noditor();
