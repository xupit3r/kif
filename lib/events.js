const EventEmitter = require('events');

class KifEmitter extends EventEmitter { }

module.exports = new KifEmitter();