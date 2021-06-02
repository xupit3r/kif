const axios = require("axios");
const debug = require('debug')('kiffy');
const { workerData, parentPort } = require("worker_threads");
const Slurp = require('./slurp.js');
const messages = require('./messages.js');
const timestamp = require('./timestamp.js');

const url = workerData.url;

axios.get(url).then(response => {
  const html = response.data;
  const slurper = new Slurp(url, html);

  debug(`processing ${url}`);
  
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
});