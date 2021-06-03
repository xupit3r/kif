const debug = require('debug')('store');
const MongoClient = require('mongodb').MongoClient;
const events = require('../../lib/events.js');
const messages = require('../../lib/messages');


const COLLECTION_NAME = 'links';
const client = new MongoClient(process.env.MONGO_CONNECTION_STRING, {
  useUnifiedTopology: true
});

debug(`trying to connect to ${process.env.MONGO_CONNECTION_STRING}`);

client.connect((err) => {
  if (err) {
    return console.error(err);
  }

  debug('Connected successfully to server');

  const db = client.db(process.env.MONGO_DBNAME);
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
});

module.exports = {
  name: 'links'
}