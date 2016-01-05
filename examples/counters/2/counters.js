/* jshint esnext: true */
const R = require('ramda');
const forwardTo = require('flyd-forwardto');
const Type = require('union-type');
const h = require('snabbdom/h');


const counter = require('./counter');


// Model
const init = (top, bottom) => ({
  topCounter: counter.init(top),
  bottomCounter: counter.init(bottom)
});

// Update
const Action = Type({
  Reset: [],
  Top: [counter.Action],
  Bottom: [counter.Action],
});

const update = (model, action) =>
  Action.case({
    Reset: () => init(0, 0),
    Top: (act) => R.evolve({topCounter: counter.update(R.__, act)}, model),
    Bottom: (act) => R.evolve({bottomCounter: counter.update(R.__, act)}, model),
  }, action);

// View
const view = R.curry((actions$, model) =>
  h('div', [
    counter.view(forwardTo(actions$, Action.Top), model.topCounter),
    counter.view(forwardTo(actions$, Action.Bottom), model.bottomCounter),
    h('button', {on: {click: [actions$, Action.Reset()]}}, 'RESET'),
  ]));

module.exports = {
  init: init,
  Action: Action,
  update: update,
  view: view,
};
