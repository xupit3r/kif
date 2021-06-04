const createCollection = require('../util/createCollection.js');
const messages = require('../../lib/messages');

/* the collection name */
const COLLECTION_NAME = 'trigrams';

/* the property to log for new additions to the collection */
const LOG_PROPERTY = 'url';

/**
 * Initializes our bigrams collection
 * 
 * @param {Object} db a reference to the Mongo database 
 * @returns a reference to the trigrams collection
 */
module.exports = function trigrams (db) {
  const collection = createCollection(db, COLLECTION_NAME, LOG_PROPERTY, {
    add: messages.MESSAGE_PROCESSED_TRIGRAMS
  });

  return collection;
}