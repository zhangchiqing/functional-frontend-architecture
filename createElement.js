'use strict';
var flyd = require('flyd');
var patch = require('snabbdom').init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/attributes'),
  require('snabbdom/modules/eventlisteners')
]);

var getNames = function(source) { return source.names; };
var getFn = function(source) { return source.fn; };

var makeSourceMap = function(action$, source) {
  if (!source) { return {}; }

  var names = getNames(source);
  var sources = names.map(function() {
    return flyd.stream();
  });

  var sourceMap = names.reduce(function(memo, name, index) {
    memo[name] = sources[index];
    return memo;
  }, {});

  getFn(source).apply(null, [action$].concat(sources));
  return sourceMap;
};

module.exports.makeSource = function(names, fn) {
  return { names: names, fn: fn };
};

module.exports.run = function(mod, container) {
  var action$ = flyd.stream();

  var sourceMap = makeSourceMap(action$, mod.source);

  var model$ = flyd.scan(
    function(state, action) {
      return mod.update(state, action, sourceMap);
    },
    mod.init.apply(null, mod.init),
    action$);

  var vnode$ = flyd.map(function(model) {
    return mod.view(action$, model, sourceMap);
  }, model$);

  flyd.scan(patch, container, vnode$);

  return {
    action$: action$,
    model$: model$,
    vnode$: vnode$,
    sources: sourceMap,
  };
};
