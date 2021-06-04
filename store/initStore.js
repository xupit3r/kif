const debug = require('debug');
const MongoClient = require('mongodb').MongoClient;

// our collections
const links = require('./collections/links.js');
const pages = require('./collections/pages.js');
const bigrams = require('./collections/bigrams.js');
const trigrams = require('./collections/trigrams.js');

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING, {
  useUnifiedTopology: true
});

const logger = debug('store:init');

/**
 * Initializes our data store/base.
 * 
 * @returns Promise resolves to an object exposing the a reference 
 * to the db and collections within this store. rejects to an error.
 */
module.exports = function initStore () {
  logger(`trying to connect to ${process.env.MONGO_CONNECTION_STRING}`);

  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        return reject(err);
      }

      const db = client.db(process.env.MONGO_DBNAME);

      logger('Connected successfully to Mongo database');

      resolve({
        db: db,
        collections: {
          links: links(db),
          pages: pages(db),
          bigrams: bigrams(db),
          trigrams: trigrams(db)
        }
      });
    });
  });
}