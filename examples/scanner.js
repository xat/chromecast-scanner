var scanner = require('..');

scanner(function(err, service) {
  console.log('chromecast "%s" running on: %s:%s',
    service.name,
    service.address,
    service.port);
});