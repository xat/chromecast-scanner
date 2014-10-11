var mdns = require('mdns-js2');

module.exports = function(opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  var browser = new mdns.Mdns(mdns.tcp('googlecast'));

  var timer = setTimeout(function() {
    browser.shutdown();
    cb(new Error('device not found'));
  }, opts.ttl || 10000);

  browser.once('ready', function() {
    browser.discover();
  });

  browser.on('update', function(service) {
    if (opts.device && opts.device !== service.name) return;
    clearTimeout(timer);
    browser.shutdown();
    // make it easier for the user to
    // resolve the address.
    service.address = service.remote.address;
    cb(null, service);
  });

};
