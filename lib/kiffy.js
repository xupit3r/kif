const axios = require("axios");
const debug = require('debug')('kiffy');
const { workerData, parentPort } = require("worker_threads");
const Slurp = require('./slurp.js');
const messages = require('./messages.js');
const timestamp = require('./timestamp.js');
const { isOKContentType } = require('./predicates.js');

const HEADER_CONTENT_TYPE = 'content-type';

const url = workerData.url;

axios.get(url).then(response => {
  const type = response.headers[HEADER_CONTENT_TYPE];

  if (isOKContentType(type)) {
    const html = response.data;
    const slurper = new Slurp(url, html);
    
    debug(`processing ${url} [${type}]`);
    
    slurper.parse();
  
    parentPort.postMessage({
      type: messages.MESSAGE_SUMMARY,
      content: {
        timestamp: timestamp(),
        html: html,
        links: slurper.links,
        freqs: slurper.freqs,
        bigrams: slurper.bigrams,
        trigrams: slurper.trigrams
      }
    });
  } else {
    debug(`ignoring ${url} [${type}]`);

    parentPort.postMessage({
      type: messages.MESSAGE_IGNORED_CONTENT
    });
  }
});