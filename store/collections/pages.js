const events = require('../../lib/events.js');
const messages = require('../../lib/messages');

/* the links collection name */
const COLLECTION_NAME = 'pages';

/**
 * Initializes our pages listeners n'at
 * 
 * @param {Object} db    a reference to the mongo database
 * @param {Object} debug a reference to the debug library
 * @returns a reference to the pages collection
 */
module.exports = function pages (db, debug) {
  const collection = db.collection(COLLECTION_NAME);

  // listen for link add events and add them to the  collection
  events.on(messages.MESSAGE_PROCESSED_PAGE, (page) => {
    if (typeof page !== 'undefined') {
      collection.insertOne(page, (err) => {
        if (err) {
          debug(`failed to add ${page.url} to ${COLLECTION_NAME}.`);
          return debug(err);
        }

        debug(`added ${page.url} to ${COLLECTION_NAME}.`);
      });
    }
  });

  return collection;
}