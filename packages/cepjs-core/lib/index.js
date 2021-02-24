const EventType = require('./eventtype');
const patternPolicies = require('./policies');
const { temporalOrdering, recurrence } = require('./reactive-libs/common/context');
const { hemisphere, Point } = require('./location');

module.exports = function createCepjsOperators(reactiveLib) {
  let library = {
    EventType,
    patternPolicies,
    temporalOrdering,
    recurrence,
    Point,
    hemisphere
  };

  if (reactiveLib.type === 'rx') {
    const createRxAdapter = require('./reactive-libs/rxjs/adapter');
    return Object.assign(library, createRxAdapter(reactiveLib));
  } else if (reactiveLib.type === 'most') {
    const createMostAdapter = require('./reactive-libs/most/adapter');
    return Object.assign(library, createMostAdapter(reactiveLib));
  } else {
    throw new Error('Adaptee not recognized!');
  }
};