'use strict';

var run = require('../../createElement').run;
var bmi = require('./bmi');

// Begin rendering when the DOM is ready
window.addEventListener('DOMContentLoaded', function() {
  var container = document.getElementById('container');
  run(bmi, container);
});
