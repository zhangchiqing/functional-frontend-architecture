'use strict';

var R = require('ramda');
var flyd = require('flyd');
var Type = require('union-type');
var h = require('snabbdom/h');
var makeSource = require('../../createElement').makeSource;

var init = R.always(0);
var Action = Type({
  Reset: [],
  BMI: [Number],
});

var update = function(model, action) {
  return Action.case({
    Reset: init,
    BMI: function(bmi) {
      return bmi;
    },
  }, action);
};

var toBMI = function(weight, height) {
  return Action.BMI(R.add(weight, height));
};


var source = makeSource(
  ['weight', 'height'],
  function(action$, weight$, height$) {
    var bmi$ = flyd.combine(function(weight, height) {
      return toBMI(weight(), height());
    }, [weight$, height$]);
    bmi$.map(action$);
  }
);

var targetValue = function(e) {
  return e.target.value;
};

var toInt = function(value) {
  return parseInt(value, 10);
};

var view = function($action, model, source) {
  return h('div', {}, [
    h('input.weight', { on: { change: R.pipe(targetValue, toInt, source.weight) } } ),
    h('input.height', { on: { change: R.pipe(targetValue, toInt, source.height) } } ),
    h('label.ami', {}, model),
  ]);
};

module.exports = {
  init: init,
  Action: Action,
  view: view,
  update: update,
  source: source,
};
