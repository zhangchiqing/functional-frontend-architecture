'use strict';
var flyd = require('flyd');
var patch = require('snabbdom').init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/attributes'),
  require('snabbdom/modules/eventlisteners')
]);

module.exports = function(mod, container) {
  var action$ = flyd.stream();
  var model$ = flyd.scan(function(model, action) {
    var newStateInfo = mod.update(model, action);
    var newState = newStateInfo[0],
        sideEffectP = newStateInfo[1];

    if (sideEffectP) {
      sideEffectP.then(action$);
    }

    return newState;
  }, mod.init(), action$);
  var vnode$ = flyd.map(mod.view(action$), model$);

  flyd.scan(patch, container, vnode$);

  return {
    action$: action$,
    model$: model$,
    vnode$: vnode$,
  };
};
