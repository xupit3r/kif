const debug = require('debug')('store');
const MongoClient = require('mongodb').MongoClient;

// our collections
const links = require('./collections/links.js');
const pages = require('./collections/pages.js');

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING, {
  useUnifiedTopology: true
});

/**
 * Initializes our data store/base.
 * 
 * @returns Promise resolves to an object exposing the a reference 
 * to the db and collections within this store. rejects to an error.
 */
module.exports = function initStore () {
  debug(`trying to connect to ${process.env.MONGO_CONNECTION_STRING}`);

  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        return reject(err);
      }

      const db = client.db(process.env.MONGO_DBNAME);

      debug('Connected successfully to Mongo database');

      resolve({
        db: db,
        collections: {
          links: links(db, debug),
          pages: pages(db, debug)
        }
      });
    });
  });
}