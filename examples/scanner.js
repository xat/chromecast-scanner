var scanner = require('..');

scanner(function(err, service) {
  console.log('MDNS: chromecast "%s" running on: %s:%s',
    service.name,
    service.address,
    service.port);
});


scanner({ type: 'ssdp'}, function(err, service) {
  console.log('SSDP: chromecast "%s" running on: %s:%s',
    service.name,
    service.address,
    service.port);
});
