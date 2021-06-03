const debug = require('debug')('store');
const events = require('../../lib/events.js');
const messages = require('../../lib/messages');

/* the links collection name */
const COLLECTION_NAME = 'links';

/**
 * Initializes our links listeners n'at
 * 
 * @param {Object} db    a reference to the mongo database
 * @param {Object} debug a reference to the debug library
 * @returns a reference to the links collection
 */
module.exports = function links (db, debug) {
  const collection = db.collection(COLLECTION_NAME);

  // listen for link add events and add them to the  collection
  events.on(messages.MESSAGE_PROCESSED_LINK, (link) => {
    if (typeof link !== 'undefined') {
      collection.insertOne(link, (err) => {
        if (err) {
          debug(`failed to add ${link.linkId} to the collection.`);
          return debug(err);
        }

        debug(`added ${link.linkId} to the collection.`);
      });
    }
  });

  return collection;
}