'use strict';
var flyd = require('flyd');
var patch = require('snabbdom').init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/attributes'),
  require('snabbdom/modules/eventlisteners')
]);

module.exports.makeSource = function(names, fn) {
  return { names: names, fn: fn };
};

var getNames = function(source) { return source.names; };
var getFn = function(source) { return source.fn; };

module.exports.run = function(mod, container) {
  var action$ = flyd.stream();

  var sources = getNames(mod.source).map(function() {
    return flyd.stream();
  });

  var sourceMap = getNames(mod.source).reduce(function(memo, name, index) {
    memo[name] = sources[index];
    return memo;
  }, {});

  getFn(mod.source).apply(null, [action$].concat(sources));

  var model$ = flyd.scan(
    function(state, action) {
      return mod.update(state, action, sourceMap);
    },
    mod.init.apply(null, mod.init),
    action$);

  var vnode$ = flyd.map(function(model) {
    return mod.view(sourceMap, action$, model);
  }, model$);

  flyd.scan(patch, container, vnode$);

  return {
    action$: action$,
    model$: model$,
    vnode$: vnode$,
    sources: sources,
  };
};
