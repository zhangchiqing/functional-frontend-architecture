/* jshint esnext: true */
const run = require('../../../createElement').run;
const counters = require('./counters');

// Begin rendering when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  run(counters, container, {
    init: [0, 0],
  });
});
