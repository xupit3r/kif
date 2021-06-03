require('dotenv').config();

const manager = require('./lib/manager.js');
const events = require('./lib/events.js');
const { MESSAGE_NEW_LINKS } = require('./lib/messages.js');
const store = require('./store/db.js');

manager();

events.emit(MESSAGE_NEW_LINKS, [{
  to: 'http://thejoeshow.net'
}]);