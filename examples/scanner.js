var scanner = require('..');

scanner(function(err, service) {
  if (err) return console.log(err.message);
  console.log('MDNS: chromecast "%s" running on: %s:%s',
    service.name,
    service.address,
    service.port);
});
