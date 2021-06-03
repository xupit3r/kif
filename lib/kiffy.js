const axios = require("axios");
const debug = require('debug')('kiffy');
const { workerData, parentPort } = require("worker_threads");
const Slurp = require('./slurp.js');
const messages = require('./messages.js');
const timestamp = require('./timestamp.js');
const { isOKContentType } = require('./predicates.js');

const HEADER_CONTENT_TYPE = 'content-type';

const link = workerData.link;

axios.get(link.to).then(response => {
  const type = response.headers[HEADER_CONTENT_TYPE];

  if (isOKContentType(type)) {
    const html = response.data;
    const slurper = new Slurp(link.to, html);
    
    debug(`processing ${link.to} [${type}]`);
    
    slurper.parse();
  
    parentPort.postMessage({
      type: messages.MESSAGE_SUMMARY,
      content: {
        timestamp: timestamp(),
        linkId: link.linkId,
        url: link.to,
        html: html,
        links: slurper.links,
        freqs: slurper.freqs,
        bigrams: slurper.bigrams,
        trigrams: slurper.trigrams
      }
    });
  } else {
    debug(`ignoring ${link.to} [${type}]`);

    parentPort.postMessage({
      type: messages.MESSAGE_IGNORED_CONTENT,
      content: {
        link: link
      }
    });
  }
});