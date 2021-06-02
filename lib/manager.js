const { v4: uuid } = require('uuid');
const { Worker } = require('worker_threads');
const messages = require('./messages.js');
const events = require('./events.js');

const MAX_WORKERS = 4;
const SLEEP_INTERVAL = 250;

const LINKS_TO_PROCESS = [];
const THREADS = {};

events.on(messages.MESSAGE_NEW_LINKS, (links) => {
  links.forEach(link => LINKS_TO_PROCESS.push(link));
});

/**
 * Spawns a new worker thread
 *
 * @param {String} url
 */
function spawn (url) {
  const worker = new Worker('./lib/kiffy.js', {
    workerData: {
      url: url
    }
  });

  console.log(`spawning a thread to process ${url}`);

  return new Promise((resolve, reject) => {
    worker.once('message', ({ type, content }) => {
      if (type === messages.MESSAGE_SUMMARY) {
  
        // notify folks that we have new links to add to the queue
        events.emit(messages.MESSAGE_NEW_LINKS, content.links);
  
        // notify folks that we have a processed document
        events.emit(messages.MESSAGE_PROCESSED_CONTENT, content);
      }

      console.log(`done processing ${url}`);

      resolve();
    });

    worker.once('error', reject);
  });

}

function spawnable () {
  return (LINKS_TO_PROCESS.length > 0) && (Object.keys(THREADS).length < MAX_WORKERS);
}


module.exports = function manager () {
  while (spawnable()) {
    let threadId = uuid();
    let thread = spawn(LINKS_TO_PROCESS.shift());
    THREADS[threadId] = thread;

    thread.finally(() => {
      delete THREADS[threadId];
    }).catch(err => console.error(err));
  }

  setTimeout(manager, SLEEP_INTERVAL);
}