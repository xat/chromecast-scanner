var mdns = require('mdns-js');

module.exports = function(opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  var browser = mdns.createBrowser(mdns.tcp('googlecast'));

  var timer = setTimeout(function() {
    browser.stop();
    cb(new Error('device not found'));
  }, opts.ttl || 10000);

  browser.once('ready', function() {
    browser.discover();
  });

  browser.on('update', function(service) {
    if (opts.device && opts.device !== service.host) return;
    clearTimeout(timer);
    timer = setTimeout(function () {
      //wait for some time if more than one chromecast on the network
      browser.stop();
    }, 5000);
    // make it easier for the user to
    // resolve the address.
    service.address = service.addresses[0];
    service.name = service.host;
    cb(null, service);
  });

};
