const debug = require('debug');
const events = require('../../lib/events.js');

/**
 * Prepares our general collection.
 * 
 * @param {Object} db a reference to the Mongo database
 * @param {String} name desired name for this collection
 * @param {String} logProperty doc property to include in log messages
 * @param {Object} messages the messages to listen on, the object should be of 
 * the format:
 * 
 *   {
 *     add: <the event to listen on for add events>
 *   }      
 * @returns 
 */
module.exports = function (db, name, idProperty, messages) {
  const collection = db.collection(name);
  const logger = debug(`store:${name}`);

  // listen for link add events and add them to the  collection
  events.on(messages.add, (doc) => {
    if (typeof doc !== 'undefined') {
      collection.insertOne(doc, (err) => {
        if (err) {
          logger(`failed to add ${doc[idProperty]} to ${name}.`);
          return logger(err);
        }

        logger(`added ${doc[idProperty]} to ${name}.`);
      });
    }
  });

  return collection;
}