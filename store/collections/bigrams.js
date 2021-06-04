const createCollection = require('../util/createCollection.js');
const messages = require('../../lib/messages');

/* the links collection name */
const COLLECTION_NAME = 'bigrams';

/* the property to log for new additions tot he bigrams collection */
const LOG_PROPERTY = 'url';

/**
 * Initializes our bigram collection
 * 
 * @param {Object} db a reference to the Mongo database 
 * @returns a reference to the bigrams collection
 */
module.exports = function bigrams (db) {
  const collection = createCollection(db, COLLECTION_NAME, LOG_PROPERTY, {
    add: messages.MESSAGE_PROCESSED_BIGRAMS
  });

  return collection;
}