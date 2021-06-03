const { v4: uuid } = require('uuid');
const debug = require('debug')('manager');
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
 * @param {Object} link a link object of the form
 * 
 *  {
 *    from: <(optional) the page that linked to this link>,
 *    to: <where the link is going, i.e. what we will be requesting>
 * }
 */
function spawn (link) {
  const worker = new Worker('./lib/kiffy.js', {
    workerData: {
      link: link
    }
  });

  debug(`spawning a thread to process ${link.to} (${link.linkId})`);

  return new Promise((resolve, reject) => {
    worker.once('message', ({ type, content }) => {
      if (type === messages.MESSAGE_SUMMARY) {
  
        // notify folks that we have new links to add to the queue
        events.emit(messages.MESSAGE_NEW_LINKS, content.links.map(url => {
          return {
            linkId: uuid(),
            from: link.to,
            to: url
          };
        }));
  
        // notify folks that we have a processed document
        events.emit(messages.MESSAGE_PROCESSED_PAGE, content);

        // store the processed link
        events.emit(messages.MESSAGE_PROCESSED_LINK, {
          ...link,
          outcome: 'success'
        });
      } else if (type === messages.MESSAGE_IGNORED_CONTENT) {
        events.emit(messages.MESSAGE_PROCESSED_LINK, {
          ...link,
          outcome: 'ignored'
        });
      }


      debug(`done processing ${link.to} (${link.linkId})`);

      resolve();
    });

    worker.once('error', (err) => {
      events.emit(messages.MESSAGE_PROCESSED_LINK, {
        ...link,
        outcome: 'failed',
        message: err.message
      });

      reject(err);
    });
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

    debug(`spawned thread ${threadId}`);

    thread.finally(() => {
      debug(`clearing thread ${threadId}`);
      delete THREADS[threadId];
    }).catch(err => console.error(err));
  }

  setTimeout(manager, SLEEP_INTERVAL);
}