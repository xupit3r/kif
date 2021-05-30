const { Worker } = require('worker_threads');

const worker = new Worker('./lib/kiffy.js', {
  workerData: {
    url: 'http://thejoeshow.net'
  }
});

worker.on('message', data => console.log(data));