/* jshint esnext: true */
const counter = require('./counter');
const run = require('../../../createElement').run;

// Begin rendering when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  run(counter, container);
});
