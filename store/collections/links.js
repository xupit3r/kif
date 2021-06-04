const createCollection = require('../util/createCollection.js');
const messages = require('../../lib/messages');

/* the collection name */
const COLLECTION_NAME = 'links';

/* the property to log for new addition to the collection */
const LOG_PROPERTY = 'linkId';

/**
 * Initializes our links collection
 * 
 * @param {Object} db a reference to the Mongo database 
 * @returns a reference to the links collection
 */
module.exports = function links (db) {
  const collection = createCollection(db, COLLECTION_NAME, LOG_PROPERTY, {
    add: messages.MESSAGE_PROCESSED_LINK
  });

  return collection;
}