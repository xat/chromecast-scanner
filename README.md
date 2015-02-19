# chromecast-scanner

scan your local network for chromecast devices and return the
first found.

### Usage
```javascript
var scanner = require('chromecast-scanner');

// MDNS:
scanner(function(err, service) {
  console.log('chromecast %s running on: %s',
    service.name,
    service.address);
});
```

### Installation

`npm install chromecast-scanner`

## License
MIT
