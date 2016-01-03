/* jshint esnext: true */
const counter = require('./counter');
const createElement = require('../../../createElement');

// Begin rendering when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  createElement(counter, container);
});
