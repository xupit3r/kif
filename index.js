const manager = require('./lib/manager.js');
const events = require('./lib/events.js');
const { MESSAGE_NEW_LINKS } = require('./lib/messages.js');

manager();

events.emit(MESSAGE_NEW_LINKS, [
  'http://thejoeshow.net'
]);