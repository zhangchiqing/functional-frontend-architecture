/* jshint esnext: true */
const R = require('ramda');
const Type = require('union-type');
const h = require('snabbdom/h');


// Update
const Action = Type({Increment: [], Decrement: []});

const update = (model, action) => Action.case({
    Increment: () => [model + 1],
    Decrement: () => [model - 1],
  }, action);

// View
const view = R.curry((actions$, model) =>
  h('div', {style: countStyle}, [
    h('button', {on: {click: [actions$, Action.Decrement()]}}, '–'),
    h('div', {style: countStyle}, model),
    h('button', {on: {click: [actions$, Action.Increment()]}}, '+'),
  ]));

const countStyle = {
  fontSize: '20px',
  fontFamily: 'monospace',
  width: '50px',
  textAlign: 'center',
};

module.exports = {
  init: R.always(0),
  Action: Action,
  update: update,
  view: view,
};