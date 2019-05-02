const _ = require('lodash/fp');
const { predEvtTypeList, deriveEvt, isWindow,
  filterEvtsByEvtTypes, AccHelper } = require('../../../helperFunctions');

module.exports = function createThresholdOperators(cepjsMost) {
  const { filter, map } = cepjsMost.lib.core;

  const operators = {};

  /**
  * This pattern counts the number of the participant events (those events whose ids are listed on eventTypeList) and
  * tests an assertion against this value. This operation works on chunks of the stream, so it must be preceded by some
  * window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {Function} assertion - a threshold assertion to be used against the number of instances.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Stream} a new stream instance.
  */
  operators.count = (eventTypeList, assertion, newEvtTypeId) => stream => {
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
    const derivation = deriveEvt('count', newEvtTypeId);

    return map(derivation,
      filter(_.compose(assertion, buffer => buffer.length),
        map(filterEvtsByEvtTypes(preds), //filters events according to a list of predicates
          filter(isWindow, //checks if it's a window
            stream))));
  }

  const createValueOps =
    (source, operation) =>
      (eventTypeList, attribute, assertion, newEvtTypeId) => stream => {
        const testAssertion = _.compose(assertion, operation, _.map(_.get(attribute)));

        const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
        const derivation = deriveEvt(source, newEvtTypeId);

        return map(_.compose(derivation, _.get('set')),
          filter(_.get('result'),
            map(buffer => new AccHelper(testAssertion(buffer), buffer),
              map(filterEvtsByEvtTypes(preds), //filters events according to a list of predicates
                filter(isWindow, //checks if it's a window
                  stream)))));
      }

  /**
  * This pattern selects an event attribute in every participant events and tests its maximal value against a threshold
  * assertion. This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the maximal value of the given attribute.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Stream} a new stream instance.
  */
  operators.valueMax = createValueOps('value max', _.max);

  /**
  * This pattern selects an event attribute in every participant events and tests its minimal value against a threshold
  * assertion. This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the minimal value of the given attribute.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Stream} a new stream instance.
  */
  operators.valueMin = createValueOps('value min', _.min);

  /**
  * This pattern selects an event attribute in every participant events and tests its average value against a threshold
  * assertion. This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the average value of the given attribute.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Stream} a new stream instance.
  */
  operators.valueAvg = createValueOps('value average', _.mean);

  return operators;
}