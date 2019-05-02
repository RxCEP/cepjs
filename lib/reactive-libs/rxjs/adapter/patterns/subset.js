const _ = require('lodash/fp');
const { predEvtTypeList, deriveEvt, isWindow, filterEvtsByEvtTypes } = require('../../../helperFunctions');

const notNullNotEmpty = _.allPass([x => !_.isEmpty(x), x => !_.isNil(x)]);

module.exports = function createSubsetOperators(cepjsRx) {
  const { filter, map } = cepjsRx.lib.operators;

  const operators = {};

  const createSubsetOps =
    (source, operation) =>
      (eventTypeList, n, attribute, newEvtTypeId) => stream => {
        const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
        const derivation = deriveEvt(source, newEvtTypeId);

        return stream.pipe(filter(isWindow), //checks if it's a window
          map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
          map(_.compose(operation(n), _.sortBy([_.get(attribute)]))),
          filter(notNullNotEmpty),
          map(derivation));

      }

  /**
  * This pattern selects a subset of the participant events with the n highest values of a given event attribute.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {number} n - the number of events to be selected according to the highest value criteria.
  * @param {(string|(string|number)[])} attribute - the given event attribute to be considered. It can either be a simple string for a simple
  * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.nHighestValues = createSubsetOps('n highest values', _.takeLast);

  /**
  * This pattern selects a subset of the participant events with the n lowest values of a given event attribute.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {number} n - the number of events to be selected according to the lowest value criteria.
  * @param {(string|(string|number)[])} attribute - the given event attribute to be considered. It can either be a simple string for a simple
  * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.nLowestValues = createSubsetOps('n lowest values', _.take);

  return operators;
}