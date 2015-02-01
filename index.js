var mdns = require('mdns-js');
var ssdp = require('node-ssdp');
var xtend = require('xtend');
var got = require('got');

var defaults = {
  ttl: 10000,
  type: 'mdns'
};

var methods = {

  mdns: function(opts, cb) {
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
    }, opts.ttl);

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
  },

  ssdp: function(opts, cb) {
    var client = new ssdp.Client();
    var timer = setTimeout(function() {
      client._stop();
      cb(new Error('device not found'));
    }, opts.ttl);

    client.on('response', function (headers, statusCode, rinfo) {
      got(headers.LOCATION, function(err, data) {
        if (err) return cb(err);
        var match = new RegExp('<friendlyName>(.*?)</friendlyName>', 'g');
        var deviceName = match.exec(data)[1];
        if (opts.device && opts.device !== deviceName) return;
        clearTimeout(timer);
        client._stop();
        cb(null, {
          address: rinfo.address,
          port: rinfo.port,
          name: deviceName
        });
      });
    });

    client.search('urn:dial-multiscreen-org:service:dial:1');
  }

};

module.exports = function(opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = defaults;
  } else {
    opts = xtend(defaults, opts);
  }

  methods[opts.type.toLowerCase()](opts, cb);
};
