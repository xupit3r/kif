const axios = require("axios");
const debug = require('debug');
const { workerData, parentPort } = require("worker_threads");
const Slurp = require('./slurp.js');
const messages = require('./messages.js');
const timestamp = require('./timestamp.js');
const { isOKContentType } = require('./predicates.js');

const HEADER_CONTENT_TYPE = 'content-type';

const link = workerData.link;

const logger = debug('kiffy');

axios.get(link.to).then(response => {
  const type = response.headers[HEADER_CONTENT_TYPE];

  if (isOKContentType(type)) {
    const html = response.data;
    const slurper = new Slurp(link.to, html);
    
    logger(`processing ${link.to} [${type}]`);
    
    slurper.parse();
  
    parentPort.postMessage({
      type: messages.MESSAGE_SUMMARY,
      outcome: 'success',
      content: {
        page: {
          timestamp: timestamp(),
          linkId: link.linkId,
          url: link.to,
          html: html,
        },
        bigrams: {
          linkId: link.linkId,
          ngrams: slurper.bigrams
        },
        trigrams: {
          linkId: link.linkId,
          ngrams: slurper.trigrams
        },
        links: slurper.links,
        freqs: slurper.freqs,
      }
    });
  } else {
    logger(`ignoring ${link.to} [${type}]`);

    parentPort.postMessage({
      type: messages.MESSAGE_IGNORED_CONTENT,
      outcome: 'ignored',
      content: {
        link: link
      }
    });
  }
}).catch(err => {
  logger(`request failed: ${err.message}`);

  if (err.response) {
    parentPort.postMessage({
      type: messages.MESSAGES_FAILED_CONTENT,
      outcome: 'error',
      content: {
        status: error.response.status,
        message: err.messsage,
        body: error.response.data,
      }
    });
  } else if (err.request) {
    parentPort.postMessage({
      type: messages.MESSAGES_FAILED_CONTENT,
      outcome: 'error',
      content: {
        noResponse: true,
        message: err.messsage
      }
    });
  } else {
    parentPort.postMessage({
      type: messages.MESSAGES_FAILED_CONTENT,
      outcome: 'error',
      content: {
        message: err.messsage
      }
    });
  }
});