require('dotenv').config();

const manager = require('./lib/manager.js');
const events = require('./lib/events.js');
const { MESSAGE_NEW_LINKS } = require('./lib/messages.js');
const initStore = require('./store/initStore.js');

initStore().then(store => {
  manager();

  events.emit(MESSAGE_NEW_LINKS, [{
    to: 'http://thejoeshow.net'
  }]);
});
