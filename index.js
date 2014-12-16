var mdns = require('mdns-js');

module.exports = function(opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  var browser = mdns.createBrowser(mdns.tcp('googlecast'));

  var getDeviceName = function(service) {
    var device = service.txt
      .map(function(entry) {
        var pieces = entry.split('=');
        return {
          type: pieces[0],
          val: pieces[1]
        }
      })
      .filter(function(entry) {
        return entry.type === 'fn';
      });
    if (!device.length) return;
    return device[0].val;
  };

  var timer = setTimeout(function() {
    browser.stop();
    cb(new Error('device not found'));
  }, opts.ttl || 10000);

  browser.once('ready', function() {
    browser.discover();
  });

  browser.on('update', function(service) {
    var deviceName = getDeviceName(service);
    if (opts.device && opts.device !== deviceName) return;
    clearTimeout(timer);
    browser.stop();
    // make it easier for the user to
    // resolve the address.
    service.address = service.addresses[0];
    service.name = deviceName;
    cb(null, service);
  });

};
