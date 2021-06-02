const { v4: uuid } = require('uuid');
const { Worker } = require('worker_threads');
const messages = require('./messages.js');
const events = require('./events.js');

// maximum number of works that can be running at a given time
const MAX_WORKERS = 4;

// when there is nothing to do , this is the time (ms) to sleep
const SLEEP_INTERVAL = 250;

// a list/queue of links to be processed
const LINKS_TO_PROCESS = [];

// a space to register our threads
const THREADS = {};

/* adds new links to the queue as they become available */
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

/**
 * Indicates if it is OK to spawn another thread.
 * 
 * @returns true if we are at a point where it is OK to spawn another 
 *          thread, false otherwise.
 */
function spawnable () {
  return (
    (LINKS_TO_PROCESS.length > 0) && 
    (Object.keys(THREADS).length < MAX_WORKERS)
  );
}


/**
 * Kicks off an maintains a process for tracking and spawning 
 * new threads for processing content.
 */
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