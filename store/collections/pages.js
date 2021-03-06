const createCollection = require('../util/createCollection.js');
const messages = require('../../lib/messages');

/* the collection name */
const COLLECTION_NAME = 'pages';

/* the property to log for new addition to the collection */
const LOG_PROPERTY = 'url';

/**
 * Initializes our pages collection
 * 
 * @param {Object} db a reference to the Mongo database 
 * @returns a reference to the pages collection
 */
module.exports = function pages (db) {
  const collection = createCollection(db, COLLECTION_NAME, LOG_PROPERTY, {
    add: messages.MESSAGE_PROCESSED_PAGE
  });

  return collection;
}